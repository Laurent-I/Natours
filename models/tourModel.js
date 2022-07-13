const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name:{
      type: 'string',
      required:[true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters.'],
        minlength:[10 , 'A tour name must be at least 10 characters'],
        // validate : [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug:String,
    duration:{
      type:Number,
      required:[true, 'A tour must have a duration.']
    },
    maxGroupSize:{
      type:Number,
      required:[true, 'A tour must have a group size.']
    },
    difficulty:{
      type:String,
      required:[true, 'A tour must have a difficulty.'],
        enum:{
          values:['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy or medium or difficult'
        }
    },
    ratingsAverage:{
      type: 'number',
      default:4.5,
        min:[1, ' Ratings must be above 1.0.'],
        max:[5, 'Rating must be below 5.0']
    },
    ratingsQuantity:{
      type: Number,
      default:0
    },
    price:{
      type: 'number',
      required: [true, 'A tour must have a price']
    },
    priceDiscount:{
        type: 'number',
        validate : {
            validator:function(val){
                //this only points to current doc on NEW document creation
                return val < this.price
        },
        message: 'Discount price ({VALUE}) must be below regular price'
        }
    },
    summary:{
      type:{
        type: String,
        trim: true
      }
    }, 
    description:{
      type: String,
      trim : true
    },
    imageCover:{
      type: String,
      required: [true, ' A tour must a have a cover image']
    },
    images:[String],
    createdAt:{
      type: Date,
      default: Date.now(),
      select:false
    }, 
    startDates:[Date],
    secretTour:{
        type: Boolean,
        default: false
    }
  },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7 ;
})

//DOCUMENT MIDDLEWARE: runs berfore the .save() and .create()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next()
});

// tourSchema.pre('save', function(next){
//     console.log('Will save document');
//     next();
// })
//
// tourSchema.post('save', function(doc, next){
//     console.log(doc);
//     next();
// })

//QUERY MIDDLEWARE
tourSchema.pre('find', function(next){
    this.find({secretTour: {$ne:true}});
    next();
})
// tourSchema.pre('findOne', function(next){
//     this.find({secretTour: {$ne:true}});
//     next();
// })

tourSchema.pre(/^find/, function(next){
    this.find({secretTour: {$ne:true}});

    this.start = Date.now();
    next();
})
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    // console.log(docs);
    next();
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: { secretTour: {$ne:true}}})
    console.log(this);
    next();
})
  const Tour = mongoose.model('Tour',tourSchema);
  
  module.exports = Tour;
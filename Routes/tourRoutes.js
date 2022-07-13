const  express = require('express');
const tourController = require('./../Controllers/tourController')

const router = express.Router();

// router.param('id',tourController.checkId)

router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/tour-stats')
.get(tourController.getTourStats);

router.route('/monthly-plan/:year')
.get(tourController.getMonthlyPlan);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour)

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.patchTour)
.delete(tourController.deleteTour);


module.exports = router;
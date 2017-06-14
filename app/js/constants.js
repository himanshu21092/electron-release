POSApp.constant('HTTP_RESPONSE', {
    'SUCCESS': 200,
    'COMPLETED': 204,
    'NOT_FOUND': 404,
    'SERVER_ERROR': 500,
    'TIMEOUT': 0,
    'VALIDATION_ERROR': 422
});

POSApp.constant('ERROR_MESSAGES', {
    'TIMEOUT': "Seems like your internet is slow or not responding. Please check.",
    'LOGIN_VALIDATION_ERROR': "Username or Password is incorrect.",
    'OTHER': "Something went wrong. Please try again.",
    'PROFILE_UPDATE_ERROR': "Could not update profile.",
    'SERVER_ERROR': "There is some error at server. Please contact Signcatch team.",
    'ONGOING_ORDER': "There is a current order going on. Please save that first in order to edit any other order."
});
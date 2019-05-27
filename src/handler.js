'use strict';

module.exports.default = async (event) => {
    console.log(event);

    return {
      statusCode: 200
    };
}
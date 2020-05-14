// Height of the image, in pixels
var _requiredHeight: number = 220;

// Width of the image, in pixels
var _requiredWidth: number = 220;

var _change_size: number = 2;

// This variable indicates the name of the image zone that we which to fix the size for
// See the instructions in 'User Requirements' for how to find and change this
var _imageZoneName: string = 'imageZone';
var ratio_str: string;
var ratio: number;


// This hook allows us to create custom functionality to run when a screen starts
gorillaTaskBuilder.onScreenStart((spreadsheet: any, rowIndex: number, screenIndex: number, row: any, container: string) => {
    // CHANGES THE BACKGROUND COLOR TO BLACK AND THE TEXT TO WHITE
    $('body').css('background-color', '#7F7F7F');
    //  $('h1, h2, h3, h4, h5, p, span').css('color', '#fff');
    // We need to check if we are on the correct display
    if (row.display == 'task') {
        // Next, we need to check if we are on the correct screen
        if (screenIndex == 1) {
            ratio_str = row.ratio;
            ratio = +ratio_str;
            // Find our image on the page and change its height and width properties
            //$(container + ' .' + _imageZoneName)
            $(container + ' .imageZone')
                .css('height', ratio * _requiredHeight + 'px')
                .css('width', ratio * _requiredWidth + 'px');
            // This will recenter our image within the zone

            gorilla.refreshLayout();
        }
        if (screenIndex == 3) {

            // Find our image on the page and change its height and width properties
            $(container + ' .imageZone')
                .css('height', _requiredHeight + 'px')
                .css('width', _requiredWidth + 'px');
            // This will recenter our image within the zone

            gorilla.refreshLayout();

        }
    }

    if (row.display == 'instructions' && screenIndex == 0) {
        // Hide the contents of the fullscreen check div
        $(container + ' .fullscreen-check').hide();
        // Check if we aren't in fullscreen
        if (!isFullscreen()) {
            // display the fullscreen check information (that requests the user be in fullscreen)
            $(container + ' .fullscreen-check').show();
            // Refresh the layout, to make sure everything is laid out on the page correct
            gorilla.refreshLayout();
            $(container + ' .fullscreen-button').on('click', (event) => {
                launchIntoFullscreen(document.documentElement);
                // forceAdvance() advances on to the next screen of a display or, if there are no more more screens, onto the next row of the spreadsheet
                gorillaTaskBuilder.forceAdvance();
            });
        } else {
            // This short timeout is necessary because of the ordering of gorillaTaskBuilder hooks (onScreenStart, forceAdvance etc.) in the backend.
            // without it, the forceAdvance function can be run before it's actually been intialised to anything
            setTimeout(function () {
                gorillaTaskBuilder.forceAdvance();
            }, 1);
        }
    }

});

function isFullscreen() {
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

// This function will launch the participant into fullscreen
// As above, we have to call a different function for every browser
function launchIntoFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}


'use strict';
angular.module('Trendicity')

/**
 * MapService is a simple wrapping service around
 * all Google Maps logic in order to make the choice
 * for Google Maps interchangable for any other map
 * solution.
 */
.service('MapService', function($log, GeolocationService) {
    var that = this,
        defaultPosition = GeolocationService.getDefaultPosition();

    /**
     * Markers container
     * @type {Array}
     */
    this.markers = [];

    this.getDefaultOptions = function () {
        return {
            zoom: 4,
            center: defaultPosition
        };
    };

    this.addMarker = function (marker) {
        // Add show / hide logic for each marker individually
        if (!marker.showPopup) {
            marker.show = false;
            marker.showPopup = function () {
                marker.show = !marker.show;
            };
        }
        this.markers.push(marker);
    };

    this.removeMarker = function (marker) {
        var i,
            markerLength = this.markers.length;

        for (i = 0; i < markerLength; i++) {
            if (this.markers[i].id === marker.id) {
                delete this.markers[i];
            }
        }
    };

    this.getCurrentPositionMarker = function () {
        var i,
            markerLength = this.markers.length,
            objReturn = null;

        for (i = 0; i < markerLength; i++) {
            if (this.markers[i] && this.markers[i].id === 'currentPosition') {
                objReturn = this.markers[i];
            }
        }

        return objReturn;
    };

    this.clearMarkers = function (blnRemoveCurrentPosition) {
        if (!!blnRemoveCurrentPosition) {
            // Clear all markers, including current position
            this.markers = [];
            return;
        }

        // Store the current position marker
        var currentPositionMarker = this.getCurrentPositionMarker();
        // Clear marker storage
        this.markers = [];
        // Re-add current position marker
        this.markers.push(currentPositionMarker);

    };

    this.getMarkers = function () {
        return this.markers;
    };

    this.addMarkersFromPosts = function (posts) {
        var i, postsLength = posts.length, post, marker;

        // Clear before adding new ones
        this.clearMarkers();

        for (i = 0; i < postsLength; i++) {
            post = posts[i];

            marker = {
                coords: post.location,
                id: post.id,
                postData: post
            };

            $log.debug('Adding marker', marker);

            this.addMarker(marker);
        }
    };

    return this;
});

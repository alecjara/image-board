(function() {
    new Vue({
        el: "#main",
        data: {
            header: "Latest Images",
            images: []
        },

        mounted: function() {
            var self = this;
            axios.get('/images')
                .then(function(resp) {
                    //console.log("resp:", resp.data.rows);
                    var imagesArrayFromServer = resp.data.rows;
                    self.images = imagesArrayFromServer;
                    //console.log('self:', self.images);
                });
        }

    });


})();

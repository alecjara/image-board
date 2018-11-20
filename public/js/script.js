(function() {
    new Vue({
        el: "#main",
        data: {
            header: "Latest Images",
            images: [],
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
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

        }, //mounted function ends
        //methods are functions that live inside of an object that runs in response to an event
        methods: {

            handleFileChange: function(e) {
                //e.target.files[0] will give me the file that I just uploaded
                //console.log("handle file change running!", e.target.files[0]);
                this.form.file = e.target.files[0];
                //console.log("this.form:", this.form);
            },
            //function that runs when user clicks submit button
            uploadFile: function(e) {
                var self = this;
                //prevent form from doing what it normally would do
                e.preventDefault();
                //console.log("this:", this.form);
                //user formData to upload file to server
                var formData = new FormData();
                //to add the stuff to where we need it: (frontend to send back to the server)
                formData.append('file', this.form.file);
                formData.append('title', this.form.title);
                formData.append('description', this.form.description);
                formData.append('username', this.form.username);

                //we need to send this to the uploads folder
                axios.post("/upload", formData).then(function(resp) {
                    console.log("Resp:", resp);
                    var imagesFromServer = resp.data.rows[0];
                    self.images.unshift(imagesFromServer);
                });
            }
        } //end of methods:
    }); //end of new Vue


})();

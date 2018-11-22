(function() {

    Vue.component("some-component", {
        //we cannot do here is the el: "#main"
        //we have to write the html or template for this part
        template: '#my-template',
        //prop is to get information from the new Vue instance to here (from parent to child)
        //it is always [] even if it is one.
        props: ['imageId'],
        //data here is not an object, is a function that returns an object but it will work the same way
        data:  function() {
            return {
                //heading: "catnip's first vue component <3"
                created_at: "",
                title: "",
                description: "",
                username: "",
                url: "",
                comment: "",
                comusername: "",
                comments: []

            };
        },

        watch: {
            imageId: function() {
                console.log("watcher running:", this.imageId);
            }
        },


        mounted: function() {

            var self = this;
            axios.get("/images/" + this.imageId).then(function(resp) {
                console.log("resp:", resp);
                self.created_at = resp.data.rows[0].created_at;
                self.title = resp.data.rows[0].title;
                self.description = resp.data.rows[0].description;
                self.username = resp.data.rows[0].username;
                self.url = resp.data.rows[0].url;
                self.image = resp.data.rows[0];
                self.comments = resp.data.rows;

            });
        },

        methods: {
            handleClick: function() {
                console.log("clicked!!!");
            },

            closeComponent: function() {
                //sending a message to new Vue:
                this.$emit("close-component");
                console.log("clicked on x");
            },

            addcomment: function(e) {
                e.preventDefault();
                var self = this;
                var formData = {
                    comment: this.comment,
                    comusername: this.comusername
                };
                console.log("formData:", formData);
                axios.post("/images/" + this.imageId, formData
                ).then(function(resp) {
                    self.comments.unshift(resp.data.rows[0]);
                //console.log("this is data rows:" resp);
                }).catch(error =>{
                    console.log("error in post comment:", error);
                });
            }

        }

    });
    //Vue instance:
    new Vue({
        el: "#main",
        data: {
            //firstName: "Ale Jaramillo",
            images: [],
            //location.hash.slice(1) is just the number that is in the url
            imageId: location.hash.slice(1) || 0,

            form: {
                title: "",
                description: "",
                username: "",
                file: null
            }
        },

        mounted: function() {
            var self = this;

            //listen for when the # changes and we have to react to it:
            window.addEventListener("hashchange", function() {
                console.log("hash has changed!", location.hash.slice(1));
                self.imageId = location.hash.slice(1);
                //check to make sure value that the user puts in the url actually corresponds to an image that exists
                //so when they add a crazy value it doesn't break our code
            });

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

            toggleComponent: function(e) {
                //ERASE THIS.SHOWCOMPONENT AND USE this.imageId = IDOFIMAGETHATWASCLICKED
                // this.showComponent = true;
                this.imageId = e.target.id;
                //console.log("this is imageId:", this.imageId);
            },

            closingTheComponent: function() {
                this.imageId = null;
                //this.showComponent = false;
            },

            handleFileChange: function(e) {
                //e.target.files[0] will give me the file that I just uploaded
                //console.log("handle file change running!", e.target.files[0]);
                this.form.file = e.target.files[0];
                //console.log("this.form:", this.form);
            },

            addcomment: function() {
                console.log("comment!!");
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
            },

            //part4 not sure if here:
            getMoreImages: function() {
                var self = this;
                var lastId = this.images[this.images.length - 1].id;

                axios.get('/get-more-images/' + lastId).then(function(resp) {
                    console.log("resp in get-more-images:", resp);
                    //mergin images array and the array that we got
                    self.images.push.apply(self.images, resp.data);
                    //if the last id in my array is 1 then the more button disappears!!!
                    //not really necessary: we can to figure out what is the last id in our database
                });
            }


        } //end of methods:
    }); //end of new Vue instance


})();

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
                form: {
                    comment: "",
                    username: ""
                }
            };
        },

        mounted: function() {
            //here should console.log the id of the image that was clicked:
            //console.log("this is the imageId:", this.imageId);
            //console.log("this of vue comp:", this);
            var self = this;
            axios.get("/images/" + this.imageId).then(function(resp) {
                console.log("resp:", resp);
                self.created_at = resp.data.rows[0].created_at;
                self.title = resp.data.rows[0].title;
                self.description = resp.data.rows[0].description;
                self.username = resp.data.rows[0].username;
                self.url = resp.data.rows[0].url;
                //var idFromServer = resp.data.rows[0];
                // self.imageId = idFromServer;
                //console.log("this imageId:", this.imageId);
            });
        },

        methods: {
            handleClick: function() {
                console.log("clicked!!!");
            },

            closeComponent: function() {
                //sending a message to new Vue:
                this.$emit("close-component");
            }
        }

    });
    //Vue instance:
    new Vue({
        el: "#main",
        data: {
            //firstName: "Ale Jaramillo",
            images: [],

            //the value the image id should have is the id of the image that was clicked
            imageId: 0,
            //only show the model when the person clicks the image.
            //FOR PART3 change HIS NEXT SHOW COMPONENT
            //we need the component to have access to that id with props
            //showComponent: true,
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

            toggleComponent: function(e) {
                //ERASE THIS.SHOWCOMPONENT AND USE this.imageId = IDOFIMAGETHATWASCLICKED
                // this.showComponent = true;
                this.imageId = e.target.id;
                console.log("this is imageId:", this.imageId);
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
    }); //end of new Vue instance


})();

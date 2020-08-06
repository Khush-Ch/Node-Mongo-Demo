const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((e) => console.error('Could not connect to MongoDB...', e))


const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,    // automatically converts it to lowercase
        // uppercase: true,
        trim: true      // Removes extra space
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v, callback) {
                setTimeout(() => {
                    const result =  v && v.length > 0;
                    callback(result);
                }, 2000);
            },
            message: 'A course should have atleast one tag'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublisheda; },
        min: 10,
        max: 200,
        get: v => Math.round(v),    // while getting rounds it if it is not rounded before
        set: v => Math.round(v)     // Sets it to round value
    }
});

const Course = mongoose.model('Course', courseSchema);


// Creating

const createCourse = async () => {
    const course = new Course({ 
        name: 'Node.js Course',
        category: 'web',
        author: 'Khush',
        tags: ['node', 'backend'],
        isPublished: false
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (e) {
        for (field in e.errors)
            console.log(e.errors[field].message);
    }

};

// createCourse();


// Reading

const getCourses = async () => {
    // const courses = await Course.find();
    // const courses = await Course.find({ author: 'Khush', isPublished: true });
    

    // const courses = await Course
    //     .find({ author: 'Khush', isPublished: true })
    //     .limit(10)
    //     .sort({ name: 1 })     // 1 for ascending order, -1 for descending order
    //     .select({ name:1, tags: 1 });   // what all properties you want it to return
    

    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)

    // const courses = await Course
    //     // .find({ price: { $gte: 10, $lte: 20 } })
    //     .find({ price: { $in: [10, 20, 30] } })
    //     .limit(10)
    //     .sort({ name: 1 })     // 1 for ascending order, -1 for descending order
    //     .select({ name:1, tags: 1 });   // what all properties you want it to return

    
    // or
    // and

    // const courses = await Course
    //     .find()
    //     .or([ { author: 'Khush' }, { isPublished: true }])
    //     .and([ { author: 'Khush' }, { isPublished: true }])
    //     .limit(10)
    //     .sort({ name: 1 })     // 1 for ascending order, -1 for descending order
    //     .select({ name:1, tags: 1 });   // what all properties you want it to return


    // Regular Expressions

    // const courses = await Course
    //     // .find({ author: /^Khush/i })     //Starts with khush, i at the end means ignore case
    //     // .find({ author: /Jain$/i })      //Ends with jain, i at the end means ignore case
    //     .find({ author: /.*Khush.*/i })      //Contains Khush
    //     .limit(10)
    //     .sort({ name: 1 })     // 1 for ascending order, -1 for descending order
    //     .select({ name:1, tags: 1 });   // what all properties you want it to return


    // Count

    // const courses = await Course
    // .find({ author: 'Khush', isPublished: true })
    // .limit(10)
    // .sort({ name: 1 })     // 1 for ascending order, -1 for descending order
    // .count();


    // Pagenation  (skip)
    const pageNumber = 2;
    const pageSize = 10;
    const courses = await Course
        .find({ author: 'Khush', isPublished: true })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({ name: 1 })     // 1 for ascending order, -1 for descending order
        .select({ name:1, tags: 1 });   // what all properties you want it to return
 

    console.log(courses);
};

getCourses();


// Updating

const updateCourse = async (id) => {
    // // First Approach
    // const course = await Course.findById(id);
    // if (!course) return;
    // // course.isPublished = true;
    // // course.author = 'Another Author';
    // course.set({
    //     isPublished: true,
    //     author: 'Another Author'
    // })

    // const result = await course.save();


    // Second Approach
    
    // const result = await Course.update({ _id: id }, {
    //     $set: {
    //         author: 'Khush',
    //         isPublished: false
    //     }
    // });

    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Khush',
            isPublished: false
        }
    }, { new: true });


    console.log(result);
};

updateCourse('5a8asd7as8d');


// Deleting

const removeCourse = async (id) => {
    // const result = await Course.deleteOne({ _id: id });
    // console.log(result);

    // OR

    const course = await Course.findByIdAndRemove(id);
    console.log(course);

};

removeCourse('5a8asd7as8d');
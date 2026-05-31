require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const premiumCourses = [
  {
    title: "DCA (Diploma in Computer Applications)",
    category: "Computer Basics",
    duration: 24,
    instructor: "Leotech Faculty",
    price: 3999,
    status: 'Active',
    modules: [
      {
        title: "Module 1: Computer Fundamentals",
        lessons: [
          {
            title: "Hardware and Operating Systems",
            type: "Notes",
            content: `
# Computer Fundamentals
> **Instructor's Note:** Learn the building blocks of modern computers.

![Computer Hardware](https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80)

## System Architecture

\`\`\`mermaid
graph TD;
    A[Input Devices] --> B[CPU - Central Processing Unit];
    B --> C[Output Devices];
    B <--> D[(Memory / RAM)];
    B <--> E[(Storage / HDD)];
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "PGDCA (Post Graduate Diploma)",
    category: "Advanced Applications",
    duration: 48,
    instructor: "Leotech Faculty",
    price: 7999,
    status: 'Active',
    modules: [
      {
        title: "Module 1: Advanced Software Engineering",
        lessons: [
          {
            title: "Software Development Life Cycle",
            type: "Notes",
            content: `
# Software Development Life Cycle (SDLC)
> **Instructor's Note:** PGDCA takes you deeper into how software is built at scale in the enterprise.

![SDLC](https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80)

### Development Phases

\`\`\`mermaid
graph LR;
    A[Analysis] --> B[Design];
    B --> C[Implementation];
    C --> D[Testing];
    D --> E[Deployment];
    E --> F[Maintenance];
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "C Programming",
    category: "Programming Languages",
    duration: 8,
    instructor: "Senior Developer",
    price: 2499,
    status: 'Active',
    modules: [
      {
        title: "Module 1: Introduction to C",
        lessons: [
          {
            title: "Pointers and Memory",
            type: "Notes",
            content: `
# Introduction to C Programming
> **Instructor's Note:** C is the mother of all modern programming languages. Master the pointers, and you master memory!

![Code Matrix](https://images.unsplash.com/photo-1515228642301-4966adfb1275?auto=format&fit=crop&w=800&q=80)

## Program Execution Flow
\`\`\`mermaid
graph TD;
    A[Source Code .c] -->|Compiler| B(Object Code .o);
    B -->|Linker| C(Executable .exe);
    C -->|OS Loader| D[RAM Memory];
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "C++ Object Oriented Programming",
    category: "Programming Languages",
    duration: 10,
    instructor: "Senior Developer",
    price: 2999,
    status: 'Active',
    modules: [
      {
        title: "Module 1: OOP Concepts",
        lessons: [
          {
            title: "Classes and Objects",
            type: "Notes",
            content: `
# C++ and Object Oriented Design
> **Instructor's Note:** C++ brings the power of objects to the performance of C.

![C++](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80)

### The 4 Pillars of OOP
\`\`\`mermaid
graph TD;
    A[Object Oriented Programming] --> B[Encapsulation];
    A --> C[Abstraction];
    A --> D[Inheritance];
    A --> E[Polymorphism];
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "Java Core & Advanced",
    category: "Programming Languages",
    duration: 16,
    instructor: "Enterprise Architect",
    price: 4999,
    status: 'Active',
    modules: [
      {
        title: "Module 1: Java Virtual Machine",
        lessons: [
          {
            title: "How Java Works",
            type: "Notes",
            content: `
# The Java Ecosystem
> **Instructor's Note:** Write once, run anywhere. This is the magic of the JVM.

![Java Coffee](https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80)

## JVM Architecture
\`\`\`mermaid
graph LR;
    A[Java Code .java] -->|Javac| B(Bytecode .class);
    B -->|Classloader| C{JVM};
    C --> D[Windows];
    C --> E[Linux];
    C --> F[Mac OS];
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "Python Programming",
    category: "Programming Languages",
    duration: 12,
    instructor: "Data Scientist",
    price: 3999,
    status: 'Active',
    modules: [
      {
        title: "Module 1: Python Basics",
        lessons: [
          {
            title: "Syntax and Data Structures",
            type: "Notes",
            content: `
# Python Programming
> **Instructor's Note:** Python is the most versatile language on the planet today. 

![Python Code](https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80)

### Python Data Types
\`\`\`mermaid
graph TD;
    A[Data Types] --> B[Numbers];
    A --> C[Strings];
    A --> D[Lists & Tuples];
    A --> E[Dictionaries];
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "HTML, CSS, & JavaScript",
    category: "Web Development",
    duration: 14,
    instructor: "Frontend Engineer",
    price: 4500,
    status: 'Active',
    modules: [
      {
        title: "Module 1: The Building Blocks of the Web",
        lessons: [
          {
            title: "DOM Manipulation",
            type: "Notes",
            content: `
# Web Fundamentals
> **Instructor's Note:** These three technologies power every single website on the internet.

![Web Design](https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80)

## How They Work Together
\`\`\`mermaid
graph TD;
    A[HTML] -->|Structure| B((The Website));
    C[CSS] -->|Design & Style| B;
    D[JavaScript] -->|Interactivity & Logic| B;
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    title: "AI & ML (Artificial Intelligence & Machine Learning)",
    category: "Data Science",
    duration: 20,
    instructor: "AI Research Team",
    price: 8999,
    status: 'Active',
    modules: [
      {
        title: "Module 1: Machine Learning Fundamentals",
        lessons: [
          {
            title: "Supervised vs Unsupervised Learning",
            type: "Notes",
            content: `
# Introduction to AI & ML
> **Instructor's Note:** Learn how machines learn from data.

![AI Brain](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80)

## The ML Pipeline
\`\`\`mermaid
graph TD;
    A[Raw Data] --> B[Data Cleaning];
    B --> C[Feature Engineering];
    C --> D[Model Training];
    D --> E{Validation};
    E -- Success --> F[Deployment];
    E -- Fail --> C;
\`\`\`
            `
          }
        ]
      }
    ]
  }
];

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const seedLiveDatabase = async () => {
  readline.question('🔒 SECURE PROMPT: Please paste your MongoDB Atlas Connection String here and press Enter: ', async (uri) => {
    try {
      if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
        console.log('⚠️ WARNING: That looks like a local database URL. Please use your MongoDB Atlas URL.');
        process.exit(1);
      }

    console.log('Connecting to LIVE Cloud Database...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    console.log('Wiping old empty courses (if any)...');
    await Course.deleteMany({});
    
    console.log('Injecting premium courses with flowcharts and images...');
    await Course.insertMany(premiumCourses);

    console.log('🎉 SUCCESS! All exactly requested courses have been successfully uploaded to your live database.');
    console.log('You can now log into your live website Admin Panel and view them!');
    process.exit(0);
    } catch (err) {
      console.error('❌ Error during seeding:', err.message);
      process.exit(1);
    }
  });
};

seedLiveDatabase();

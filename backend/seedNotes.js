require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const courseData = {
  "DCA": [
    {
      title: "Module 1: Computer Fundamentals",
      content: `
# Computer Fundamentals
> **Instructor's Note:** Let's start from the very beginning. Understanding hardware and software is the first step in DCA.

## What is a Computer?
A computer is an electronic device that manipulates information, or data. It has the ability to **store, retrieve, and process** data.

### Core Components
1. **CPU (Central Processing Unit):** The brain of the computer.
2. **RAM (Random Access Memory):** Short-term memory for active tasks.
3. **Storage (HDD/SSD):** Long-term data retention.

## Number Systems Table

| System | Base | Characters Used |
|--------|------|-----------------|
| Binary | 2    | 0, 1 |
| Decimal| 10   | 0-9 |
| Hex    | 16   | 0-9, A-F |

*Dive into the video for a visual breakdown of the motherboard!*
`
    },
    {
      title: "Module 2: Operating Systems & MS Office",
      content: `
# Operating Systems & MS Office

An **Operating System (OS)** manages all of the software and hardware on the computer. Most of the time, there are several different computer programs running at the same time, and they all need to access your computer's CPU, memory, and storage.

## Microsoft Office Suite
- **Word:** Word processing, letter writing.
- **Excel:** Spreadsheets, data analysis.
- **PowerPoint:** Presentations.

### Excel Formula Example
\`\`\`excel
=SUM(A1:A10)
=AVERAGE(B1:B20)
=IF(C2>50, "Pass", "Fail")
\`\`\`
`
    }
  ],
  "PGDCA": [
    {
      title: "Module 1: Advanced Software Engineering",
      content: `
# Advanced Software Engineering
> **Instructor's Note:** PGDCA takes you deeper into how software is built at scale.

## SDLC (Software Development Life Cycle)
The SDLC is a process used by the software industry to design, develop and test high quality softwares.

### Phases
1. Requirement Analysis
2. Design
3. Implementation (Coding)
4. Testing
5. Deployment
6. Maintenance

\`\`\`mermaid
graph LR;
    A[Analysis] --> B[Design];
    B --> C[Coding];
    C --> D[Testing];
    D --> E[Maintenance];
\`\`\`
`
    },
    {
      title: "Module 2: Database Management Systems (DBMS)",
      content: `
# Database Management Systems

A **DBMS** is a software designed to store, retrieve, define, and manage data in a database.

## SQL vs NoSQL

| Feature | SQL (Relational) | NoSQL (Non-Relational) |
|---------|------------------|------------------------|
| Structure | Table-based | Document/Key-Value |
| Schema | Pre-defined | Dynamic |
| Scaling | Vertically | Horizontally |

### Basic SQL Query
\`\`\`sql
SELECT first_name, last_name 
FROM students 
WHERE enrolled_course = 'PGDCA'
ORDER BY last_name ASC;
\`\`\`
`
    }
  ],
  "C-PROGRAMMING": [
    {
      title: "Module 1: Introduction to C",
      content: `
# Introduction to C Programming
> **Instructor's Note:** C is the mother of all modern programming languages. Master the pointers, and you master memory!

## Hello World in C
Every programmer's journey begins here.

\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

## Data Types

| Type | Size | Range | Format Specifier |
|------|------|-------|------------------|
| int | 4 bytes | -2,147,483,648 to 2,147,483,647 | %d |
| float | 4 bytes | 1.2E-38 to 3.4E+38 | %f |
| char | 1 byte | -128 to 127 | %c |
`
    },
    {
      title: "Module 2: Pointers and Memory",
      content: `
# Pointers and Memory Allocation

A **pointer** is a variable whose value is the address of another variable.

## Syntax
\`\`\`c
int var = 20;   /* actual variable declaration */
int *ip;        /* pointer variable declaration */
ip = &var;      /* store address of var in pointer variable*/
\`\`\`

### Dynamic Memory
- \`malloc()\`: Allocates requested size of bytes and returns a void pointer.
- \`calloc()\`: Allocates space for an array of elements, initializes them to zero.
- \`free()\`: Deallocates previously allocated memory.
`
    }
  ],
  "JAVA": [
    {
      title: "Module 1: Object-Oriented Programming",
      content: `
# Java Object-Oriented Programming
> **Instructor's Note:** Java is strictly object-oriented. Everything is an object!

## The 4 Pillars of OOP
1. **Encapsulation:** Wrapping data (variables) and code acting on the data (methods) together as a single unit.
2. **Inheritance:** Mechanism where one class acquires the properties of another.
3. **Polymorphism:** Ability of a variable, function or object to take on multiple forms.
4. **Abstraction:** Hiding implementation details and showing only functionality to the user.

## Example: A Simple Java Class
\`\`\`java
public class Student {
    private String name;
    
    public Student(String name) {
        this.name = name;
    }
    
    public void study() {
        System.out.println(this.name + " is studying Java.");
    }
    
    public static void main(String[] args) {
        Student s = new Student("Alice");
        s.study();
    }
}
\`\`\`
`
    },
    {
      title: "Module 2: Java Collections Framework",
      content: `
# Java Collections

The Collections Framework provides a unified architecture for storing and manipulating a group of objects.

| Interface | Implementation | Ordering | Duplicates |
|-----------|----------------|----------|------------|
| List | ArrayList | Ordered | Allowed |
| Set | HashSet | Unordered| Not Allowed|
| Map | HashMap | Key-Value| Keys Unique|

\`\`\`java
import java.util.ArrayList;
import java.util.List;

public class CollectionsExample {
    public static void main(String[] args) {
        List<String> courses = new ArrayList<>();
        courses.add("Java");
        courses.add("Spring Boot");
        System.out.println("Courses: " + courses);
    }
}
\`\`\`
`
    }
  ],
  "PYTHON": [
    {
      title: "Module 1: Python Basics & Syntax",
      content: `
# Python Basics
> **Instructor's Note:** Python emphasizes readability. Notice the lack of curly braces!

## Variables and Data Types
Python is dynamically typed. You don't need to declare the type.

\`\`\`python
# This is a comment
name = "John Doe"  # String
age = 25           # Integer
is_student = True  # Boolean

print(f"{name} is {age} years old.")
\`\`\`

## Lists and Dictionaries

| Structure | Syntax | Mutable? |
|-----------|--------|----------|
| List      | \`[1, 2, 3]\` | Yes |
| Tuple     | \`(1, 2, 3)\` | No  |
| Dict      | \`{"a": 1}\`  | Yes |
`
    },
    {
      title: "Module 2: Functions and Logic",
      content: `
# Functions and Logic

Functions in Python are defined using the \`def\` keyword.

\`\`\`python
def calculate_grade(score):
    """Returns the letter grade based on score."""
    if score >= 90:
        return 'A'
    elif score >= 80:
        return 'B'
    else:
        return 'C'

# Using the function
print(f"Your grade is: {calculate_grade(85)}")
\`\`\`

### Flowchart Logic
\`\`\`mermaid
graph TD;
    A[Input Score] --> B{>= 90?};
    B -- Yes --> C[Return A];
    B -- No --> D{>= 80?};
    D -- Yes --> E[Return B];
    D -- No --> F[Return C];
\`\`\`
`
    }
  ],
  "AI & ML": [
    {
      title: "Module 1: Intro to Machine Learning",
      content: `
# Introduction to Machine Learning
> **Instructor's Note:** AI is the future. Let's learn how machines learn from data.

## What is ML?
Machine Learning is a subset of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.

### Types of ML
1. **Supervised Learning:** Labeled data (e.g., Classification, Regression).
2. **Unsupervised Learning:** Unlabeled data (e.g., Clustering, Association).
3. **Reinforcement Learning:** Learning via rewards and punishments.

## Common Libraries in Python
| Library | Purpose |
|---------|---------|
| NumPy | Numerical computing |
| Pandas | Data manipulation |
| Scikit-learn | Classic ML algorithms |
| TensorFlow | Deep Learning |
`
    },
    {
      title: "Module 2: Building Your First Model",
      content: `
# Building Your First Model

Let's build a simple Linear Regression model using Scikit-Learn.

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression

# 1. Prepare Data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# 2. Initialize Model
model = LinearRegression()

# 3. Train Model
model.fit(X, y)

# 4. Predict
prediction = model.predict([[6]])
print(f"Prediction for x=6: {prediction[0]}")
\`\`\`

This simple workflow—**Prepare -> Initialize -> Train -> Predict**—is the foundation of most ML tasks.
`
    }
  ]
};

const getGenericContent = (courseTitle, moduleNum) => {
  return "# Welcome to " + courseTitle + " - Module " + moduleNum + "\n\nThis module covers the core topics of " + courseTitle + ". Please check back later for detailed notes.";
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leotech');
    console.log('Connected to DB');

    const courses = await Course.find();
    console.log("Found " + courses.length + " courses to update.");

    for (const course of courses) {
      const courseTitleUpper = course.title.toUpperCase();
      let predefinedModules = courseData[courseTitleUpper];
      
      const newModules = [];
      
      if (predefinedModules) {
        // Use predefined structured modules
        predefinedModules.forEach((mod) => {
          newModules.push({
            title: mod.title,
            lessons: [
              {
                title: 'Module Notes',
                type: 'Notes',
                content: mod.content.trim()
              },
              {
                title: 'Video Lecture',
                type: 'Video',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              }
            ]
          });
        });
      } else {
        // Fallback generic modules if course title doesn't match
        for (let i = 1; i <= 2; i++) {
          newModules.push({
            title: "Module " + i,
            lessons: [
              {
                title: 'Module Notes',
                type: 'Notes',
                content: getGenericContent(course.title, i)
              }
            ]
          });
        }
      }

      course.modules = newModules;
      await course.save();
      console.log("Updated " + course.title + " with specific notes.");
    }

    console.log('Successfully seeded courses with UNIQUE incredible Markdown content!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

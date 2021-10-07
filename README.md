# FileX
A file manager that runs in the browser.

Details about the development of FileX can be found [here](#dev-story).

## Features
FileX opens up a a file tree explorer in the browser. It is called from the command line and accepts one or more directory paths as arguments. On top of offering a live tree view of your filesystem, FileX has the following features:
- Create a new file or folder
- Edit a file or folder name
- Delete a file or folder
- Move a file or folder using drag and drop
- Display detailed information about a selected file

## Usage
If you are on Windows, the fastest way to use the app is to download the executable file from the [Release](https://github.com/snowfrogdev/filex/releases/) section on the Github repo for this project and save it to a location of your choice. You'll notice that the file is a respectable 240 MB, that's because it includes the NodeJS binaries.

Alternatively, after cloning this repo to your system, you will have to [build](#build) it before you can run the app.

### Running the app
Open a terminal in the directory where the `filex.exe` is located (`dist/bin` if you build the project, a directory of your choice if you download it from the [Release](https://github.com/snowfrogdev/filex/releases/) section).

As an optional (useful) step, you may want to add the directory to the PATH so that you can easily use the command from various directories. Here's how you would do it in Windows Command Prompt:

```
set PATH=%PATH%;%CD%
```

To run the app:
```
filex [...dirs]
```

You can pass in any number of directories as arguments, separated by a space. The command will work with absolute or relative paths. Example:
```
filex ./ foo ../../bar c:/some/directory
```

If you don't pass in any arguments, the app will lauch with the current directory as the only target.

## Build
If you want to build the project, you will need to have [NodeJS](https://nodejs.org/en/download/) verson 14 or higher installed on your system.

Start by installing the project's dependencies. This step will take a while as I have made use of many libraries and frameworks to save on development time.
```
npm install
```

Then you are ready to build the project. This step will also take a while. Don't be alarmed if you see some warnings and progress seems to be slow, just let it run its course.
```
npm run build-bin
```

Once this step is done, you will find the Windows executable in `dist/bin`.

If you are not on Windows, you can run the app using NodeJs and the build located in `dist/apps/api`. You can run the app on Linux, Mac or Windows, from this directory by doing:
```
node main.js [...dirs]
```

## Dev Story
The current version of FileX was developed in about 4 days. I try to follow Kent Beck's philosophy when making software: "First make it work, then make it right, and if needed make it fast".

Given the time I had to develop the features in the app, I'd honestly say I'm barely done with the "make it work" phase.🙂 And there are a lot of things I would do to make it right... and fast.

### Make it work
One of the early decisions I have made, given that I had a 4 day budget, was to make extensive use of third party libraries to save on development time.

Here are some of the frameworks and libraries used in the project:
- Angular & Angular Material, for the Single Page Application front end and UI/UX side of things.
- NestJS, for the back end.
- Commander, for dealing with the command line arguments and offering a half-decent command line user experience.
- Chokidar, to listen to file system events.
- Socket.io, for push communication from the back end to the front end.
- Nx, to manage the project's dependencies, building and development.
- Pkg, to build the app into a binary executable file.
- Other smaller libs

### Make it right
I think using these libraries was the smart thing to do and allowed me to implement a half decent little app. But one thing I would definitely correct if this was a long term project is that I depend directly on most of those third-party libraries. To save time, I have skipped the step I would normally take of wrapping these dependencies using something like the Adapter pattern to allow for easier testing and change of implementation if needed.

Another thing that I have skipped is writing proper automated tests. I'm a fan of TDD, and I did write a few exploratory tests to see how some of these third-party libraries worked but they were of poor quality and I opted not to keep them in the project as they had served their purpose.

Finally, in terms of code quality, I have made an effort to keep my functions and classes at a relatively managable size but the current state of the code reflects the fact that I focused first on making it work and had very little time to refactor the code. I would normally break the classes and functions down even more. I also occasionally use magic strings and numbers and some duplication.

### Make it fast
Finally, in terms of performance, there is so much I can improve there. At first, I tried using the [directory-tree](https://www.npmjs.com/package/directory-tree) library to get a tree data structure from the file system. It offers a nice,  easy to use, API and has a decent amount of downloads on NPM and stars on Github. But after trying it I was very disapointed in its performance. It doesn't work asynchronously and is soooooo slow. I ended up writing my own asynchronous Depth First Search algorithm to walk directory trees and in my benchmarks, my algorithm was more than 6 times faster. As a matter of fact, once I'm done with the current project I'm definitely going to make an NPM package out of it and offer it as a faster alternative to [directory-tree](https://www.npmjs.com/package/directory-tree).

Still, there is much than can be done to improve the app's performance. If you're crazy enough to try to run it on your system's root directory, or other wide and deep enough directory trees, the app will take a good amount of time to get a result on screen. In some cases the operation will just fail. I know the technical reasons why, and have tons of ideas to improve this (limit the depth of the tree walk, build the tree incrementally and asynchronously, write a walker in Rust and get NodeJS to interop with it 😆) but I didn't have the time to tackle these.
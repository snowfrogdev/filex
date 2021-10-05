# FileX
A file manager that runs in the browser.

## Features
FileX opens up a a file tree explorer in the browser. It is called from the command line and accepts one or more directory paths as arguments. On top of offering a live tree view of your filesystem, FileX has the following features:
- Create a new file or folder
- Edit a file or folder name
- Delete a file or folder
- Move a file or folder using drag and drop
- Display detailed information about a selected file

## Running the app
If you are on Windows, the fastest way to use the app is to download the executable file from the Release section on the Github repo for this project and save it to a location of your choice. 

Alternatively, after cloning this repo to your system, you will have to [build](#build) it before you can run the app.

Open a terminal in the directory where the `filex.exe` is located (`dist/bin` if you build the project, a directory of your choice if you download it from the Release section).

As an optional (useful) step, you may want to add the directory to the PATH so that you can easily use the command from various directories. Here's how you would do it in Windows Command Prompt:

```
set PATH=%PATH%;%CD%
```

To run the app:
```
filex [...dirs]
```

You can pass in any number of directories as argument, separated by a space. The command will work with absolute or relative paths. Example:
```
filex ./ foo ../../bar c:/some/directory
```

If you don't pass in any arguments, the app will lauch with the current directory as the only target.

## Build
If you want to build the project, you will need to have [NodeJS](https://nodejs.org/en/download/) verson 14 or higher installed on your system.

Start by installing the projects dependencies. This step will take a while as I have made use of many libraries and frameworks to save on development time.
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

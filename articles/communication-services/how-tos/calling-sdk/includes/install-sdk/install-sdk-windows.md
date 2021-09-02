## Setting up

### Creating the Visual Studio project

In Visual Studio 2019, create a new `Blank App (Universal Windows)` project. After entering the project name, feel free to pick any Windows SDK greater than `10.0.17134`. 

### Install the package and dependencies with NuGet Package Manager

Tha Calling SDK APIs and libraries are publicly available via a NuGet package.
The following steps exemplify how to find, download, and install the Calling SDK NuGet package.

1. Open NuGet Package Manager (`Tools` -> `NuGet Package Manager` -> `Manage NuGet Packages for Solution`)
2. Click on `Browse` and then type `Azure.Communication.Calling` in the search box.
3. Make sure that `Include prerelease` check box is selected.
4. Click on the `Azure.Communication.Calling` package.
5. Select the checkbox corresponding to the CS project on the right-side tab.
6. Click on the `Install` button.
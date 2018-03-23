## Install the Connected Environment CLI
Connected Environment requires minimal local machine setup. Most of your development environment's configuration gets stored in the cloud, and is shareable with other users.

### Install on Mac
Download and install the Connected Environment CLI:
```cmd
curl -L https://aka.ms/get-vsce-mac | bash
```

### Install on Windows
1. Install [Git for Windows](https://git-scm.com/downloads), select the default install options. 
1. Download **kubectl.exe** from [this link](https://storage.googleapis.com/kubernetes-release/release/v1.9.0/bin/windows/amd64/kubectl.exe) and **save** it to a location on your PATH.
1. Download and run the [Connected Environment CLI Installer](https://aka.ms/get-vsce-windows). 

### Install on Linux
Coming soon...

## Get Kubernetes debugging for VS Code
While you can use the Connected Environment CLI as a standalone tool, rich features like Kubernetes debugging are available for .NET Core and Node.js developers using VS Code.

1. If you don't have it, install [VS Code](https://code.visualstudio.com/Download).
1. Download the [VS Connected Environment extension](https://aka.ms/get-vsce-code).
1. Install the extension: 

```cmd
code --install-extension path-to-downloaded-extension/vsce-0.1.0.vsix
```

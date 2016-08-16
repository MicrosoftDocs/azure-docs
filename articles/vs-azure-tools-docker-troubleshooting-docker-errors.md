<properties
   pageTitle="Troubleshooting Docker Client Errors on Windows Using Visual Studio | Microsoft Azure"
   description="Troubleshoot problems you encounter when using Visual Studio to create and deploy web apps to Docker on Windows by using Visual Studio."
   services="azure-container-service"
   documentationCenter="na"
   authors="allclark"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="06/08/2016"
   ms.author="allclark" />

# Troubleshooting Visual Studio Docker Development

When working with Visual Studio Tools for Docker Preview, you may encounter some problems due to the preview nature.
The following are some common issues and resolutions.

##Failed to configure Program.cs for Docker support

When adding docker support, `.UseUrls(Environment.GetEnvironmentVariable("ASPNETCORE_SERVER.URLS"))` must be added to the WebHostBuilder().
If Program.cs the `Main()` function or a new WebHostBuilder class wasn't found, a warning will be displayed.
`.UseUrls()` is required to enable Kestrel to listen to incoming traffic, beyond localhost when run within a docker container.
Upon completion, the typical code will look like the following:

```
public class Program
{
    public static void Main(string[] args)
    {
        var host = new WebHostBuilder()
            .UseUrls(Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? String.Empty)
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory() ?? "")
            .UseIISIntegration()
            .UseStartup<Startup>()
            .Build();

        host.Run();
    }
}
```

UseUrls() configured the WebHost to listen to incoming URL traffic.
[Docker Tools for Visual Studio](http://aka.ms/DockerToolsForVS) will configure the environment variable in the dockerfile.debug/release mode as follows:

```
# Configure the listening port to 80
ENV ASPNETCORE_SERVER.URLS http://*:80
```

## Volume Mapping not functioning
To enable Edit & Refresh capabilities, volume mapping is configured to share the source code of your project to the .app folder within the container.
As files are changed on your host machine, the containers /app directory uses the same directory.
In docker-compose.debug.yml, the following configuration enables volume mapping

```
volumes:
    - ..:/app
```

To test if volume mapping is functioning, try the following command:

**From Windows**

```
docker run -it -v /c/Users/Public:/wormhole busybox
/ # ls
```

You should see a directory listing from the Users/Public folder.
If no files are displayed, and your /c/Users/Public folder isn't empty, volume mapping is not configured properly. 

```
bin       etc       proc      sys       usr       wormhole
dev       home      root      tmp       var
```

Change into the wormhole directory to see the contents of the `/c/Users/Public` directory:

```
/ # cd wormhole/
/wormhole # ls
AccountPictures  Downloads        Music            Videos
Desktop          Host             NuGet.Config     a.txt
Documents        Libraries        Pictures         desktop.ini
/wormhole #
```

**Note:** *When working with Linux VMs, the container file system is case sensitive.*  

If you're unable to see the contents, try the following:

**Docker for Windows beta**
- Verify the Docker for Windows desktop app is running by looking for the moby icon in system tray, and making sure it's white and functional.
- Verify volume mapping is configured by right-clicking the moby icon in the system tray, selecting settings and cliking **Manage shared drives...**

**Docker Toolbox w/VirtualBox**

By default, VirtualBox shares `C:\Users` as `c:/Users`. If possible, move your project below this directory. Otherwise, you may manually add it to the VirtualBox [Shared folders](https://www.virtualbox.org/manual/ch04.html#sharedfolders).
	
##Build : Failed to build the image, Error checking TLS connection: Host is not running

- Verify the default docker host is running. See the article, [Configure the Docker client](./vs-azure-tools-docker-setup.md).

##Using Microsoft Edge as the default browser

If you are using the Microsoft Edge browser, the site might not open as Edge considers the IP address to be unsecured. To remedy this, perform the following steps:

1. Go to **Internet Options**.
    - On Windows 10, you can type `Internet Options` in the Windows Run box.
    - In Internet Explorer, you can go to the **Settings** menu and select **Internet Options**. 
1. Select **Internet Options** when it appears. 
1. Select the **Security** tab.
1. Select the **Local Intranet** zone.
1. Select **Sites**. 
1. Add your virtual machine's IP (in this case, the Docker Host) in the list. 
1. Refresh the page in Edge, and you should see the site up and running. 
1. For more information on this issue, visit Scott Hanselman's blog post, [Microsoft Edge can't see or open VirtualBox-hosted local web sites](http://www.hanselman.com/blog/FixedMicrosoftEdgeCantSeeOrOpenVirtualBoxhostedLocalWebSites.aspx). 

##Troubleshooting version 0.15 or earlier


###Running the app causes PowerShell to open, display an error, and then close. The browser page doesn’t open.

This could be an error during `docker-compose-up`. To view the error, perform the following steps:

1. Open the `Properties\launchSettings.json` file
1. Locate the Docker entry.
1. Locate the line that begins as follows:

    ```
    "commandLineArgs": "-ExecutionPolicy RemoteSigned …”
    ```
	
1. Add the `-noexit` parameter so that the line now resembles the following. This will keep PowerShell open so that you can view the error.

    ```
	"commandLineArgs": "-noexit -ExecutionPolicy RemoteSigned …”
    ```

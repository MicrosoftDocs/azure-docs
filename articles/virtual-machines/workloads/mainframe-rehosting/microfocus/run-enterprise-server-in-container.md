# Run Micro Focus Enterprise Server 4.0 in a Docker Container on Azure

For better performance, scalability, and agility, run Micro Focus Enterprise Server 4.0 in a Docker container on Azure. This walkthrough shows you how based on the Windows CICS (Customer Information Control System) acctdemo demonstration for Enterprise Server.

Docker adds portability and isolation to applications. For example, you can export a Docker image from one Windows VM to another, or from another repository to another Windows server with Docker. The Docker image runs in the new location ith the same configuration—without having to install Enterprise Server, because it’s part of the image. Note that licensing considerations still apply.

This walkthrough shows you how to run a mainframe application in a container using the **Windows 2016 Datacenter with Containers** virtual machine (VM) from the Azure Marketplace. This VM includes **Docker 18.09.0**. The steps below show you how to deploy the container, run it, and then connect to it with a 3270 emulator.

## Prerequisites

Before getting started, check out these prerequisites:

-   An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

-   The Micro Focus software and a valid license (or trial license). If you are an existing Micro Focus customer, contact your Micro Focus representative. Otherwise, [request a trial](https://www.microfocus.com/products/enterprise-suite/enterprise-server/trial/).

>   **Note:** The Docker demonstration files are included with Enterprise Server 4.0. This walkthrough uses ent\_server\_dockerfiles\_4.0\_windows.zip. Access it from the same place that you accessed the Enterprise Server installation file, or go to *Micro Focus* to get started.

-   The documentation for [Enterprise Server and Enterprise Developer](https://www.microfocus.com/documentation/enterprise-developer/#").

## Create a VM

1.  Secure the media from ent\_server\_dockerfiles\_4.0\_windows.zip and the accompanying licensing file, ES-Docker-Prod-XXXXXXXX.mflic, which is required to build the Docker images.

2.  Create the VM. To do this, open Azure portal, select **Create a resource** from the top left, and filter by *Docker*. In the restuls, select **Windows Server 2016 Datacenter – with Containers**.

![Azure portal search results](media/container-01.jpg)

1.  To configure the properties for the VM, choose instance details:

    1.  Note that the Windows Server with Containers VM is available only in certain VM sizes. For this walkthough, consider using a **Standard  DS2\_v2** VM with 2 vCPUs and 7 GB of memory.

    2.  Select the **Region** and **Resource Group** you would like to deploy to.

    3.  For **Availability options**, use the default setting. None are needed for this walkthrough.

    4.  For **Username**, type the administrator account you want to use and the password.

    5.  Make sure **port 3389 RDP** is open. This is the only port you need to publicly expose. You need it to log on to the VM. After this you can accept all of the default values and click **Review+ create**.

![Create a virtual machine pane](media/Container_02.jpg)

1.  The deployment could take a couple of minutes. When it is complete you are presented with a message stating your VM has been created.

2.  Click **Go to Resource** to go to the **Overview** blade for your VM.

3.  On the right, click the **Connect** button. The **Connect to virtual machine** options appear on the right.

4.  Click the **Download RDP File** button to download the RDP file that allows you to attach to the VM.

5.  After the file has finished downloading, open it and type in the username and password you created for the VM.

>   **Note:** Make sure you are not using your corporate credentials to log on. The RDP client assumes you may want to use these. You do not.

1.  Select **More Choices**, then select your VM credentials.

Now the VM is running and attached via RDP, and you are logged.

## Create a sandbox directory and upload the zip file

1.  Create a directory on the VM where you can upload the demo and licence files. For example, **C:\\Sandbox**.

2.  Upload **ent\_server\_dockerfiles\_4.0\_windows.zip** and the **ES-Docker-Prod-XXXXXXXX.mflic** to the directory you created.

3.  Extract the contents of the zip file to the **ent\_server\_dockerfiles\_4.0\_windows** directory created by the extract process. Note that this directory includes a readme file (as .html and .txt file) and two subdirectories, **EnterpriseServer** and **Examples**.

4.  Copy **ES-Docker-Prod-XXXXXXXX.mflic** to the following two directories:

>   **C:\\Sandbox\\ent\_server\_dockerfiles\_4.0\_windows\\EnterpriseServer**
>   **C:\\Sandbox\\ent\_server\_dockerfiles\_4.0\_windows\\Examples\\CICS**

**Important** - Make sure you copy the licensing file to both directories. They are required for the Docker build step to make sure the images are properly licensed.

## Check Docker version and create base image

**Very important:** To create the appropriate Docker image you will need is a two-step process. First you will need to create the Enterprise Server 4.0 base image. After this is complete you will create another image for the x64 platform. You also have the option to create a x86 (32-bit) image, but since you are running this in Azure, you will need the 64-bit image.

1.  Open a command prompt.

2.  Check that Docker is installed by typing the following at the command prompt:
```
     docker version
```
>   At the time of this walkthrough, the version was 18.09.0 as the following screenshow shows:

![Commmand prompt](media/Container_03.jpg)

1.  To change the directory, type:
```
     cd \Sandbox\ent_server_dockerfiles_4.0_windows\EnterpriseServer
```
2.  Type **bld.bat IacceptEULA** to begin the build process for the initial base image. This process takes a few minutes to run. When it is done, the results are displayed as follows. Notice the two images that have been created, one for x64 and one for x86.

![Command window showing images](media/Container_04.jpg)

1.  To create the final image for the CICS demonstration, switch to the CICS directory by typing **cd\\Sandbox\\ent\_server\_dockerfiles\_4.0\_windows\\Examples\\CICS**.

2.  To create the image, type **bld.bat x64**. The process runs for a few minutes. When it is done, a message notifies you that the image was created.

3.  To confirm this, type **docker images** to display a list of all of the Docker images installed on the VM. Make sure **microfocus/es-acctdemo** is one of them.

![Command window showing es-acctdemo image](media/Container_05.jpg)

## Run the image 

1.  To launch Enterprise Server 4.0 and the acctdemo application, at the command prompt type:
```
docker run -p 16002:86/tcp -p 16002:86/udp -p 9040-9050:9040-9050 -p 9000-9010:9000-9010 -ti --network="nat" --rm microfocus/es-acctdemo:win\_4.0\_x64
```

2.  Install a 3270 terminal emulator such as [x3270](http://x3270.bgp.nu/) and use it to attach, via port 9040, to the image that’s running.

3.  Get the IP address of the acctdemo container so Docker can acts as a DHCP server for the containers it manages. To do this:

    1.  Get the ID of the running container. Type **Docker ps** at the command prompt and note the ID. In this example, it is **22a0fe3159d0**. You need this for the next step.

    2.  To get the IP address for the acctdemo container, type the following, using the container ID from the previous step:
```
   docker inspect \<containerID\> --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}"
```
>   For example:
```   
    docker inspect 22a0fe3159d0 --format="{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}"
```
4.  Note the IP address for the acctdemo image. For example, the address in the following output is 172.19.202.52.

![Command window showing IP address](media/Container_06.jpg)

5.  Mount the image using the emulator. Configure the emulator to use the address of the acctdemo image and port 9040. For this walkthrough it is **172.19.202.52:9040**. Yours will be similar. The Signon to CICS screen opens.

![Signon to CICS screen](media/Container_07.jpg)

6.  Log on to the CICS Region by entering **SYSAD** for the **USERID** and **SYSAD** for the **Password**.

7.  Clear the screen, using the emulator’s keymap. For x3270, select the **Keymap** menu option.

8.  To launch the acctdemo application, type **ACCT**. The initial screen for the application is displayed.

![Account Demo File Menu screen](media/Container_08.jpg)

9.  Experiment with display account types. For example, type **D** for the Request and **11111** for the **ACCOUNT**. Other account numbers to try are 22222, 33333, and so on.

![Account File Record Display in 3270 emulator](media/Container_09.jpg)

1.  To display the Enterprise Server Administration console, go to the command prompt and type:
```
start http:172.19.202.52:86.
```
![Enterprise Server Administration console](media/Container_010.jpg)

Now you are running and managing a CICS application in a Docker container.

## Next steps

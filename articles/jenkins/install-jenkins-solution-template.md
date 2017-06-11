Create your first Jenkins Master on a Linux (Ubuntu) VM on Azure
================================================================

This quickstart shows how to install the latest stable Jenkins version on a Linux (Ubuntu 14.04 LTS) VM along with the tools and plugins configured to work with Azure. These includes: \* Git for source control \* Azure credential plugin for connecting securely \* Azure VM Agents plugin for elastic build, test and continuous integration \* Azure Storage plugin for storing artifacts \* Azure CLI to deploy apps using scripts

Prerequisites
-------------

To complete this quickstart, you need:

-   an Azure account ([get a free trial](https://azure.microsoft.com/pricing/free-trial/))

Create the VM in Azure by deploying the solution template
---------------------------------------------------------

Go to http://aka.ms/jenkins-on-azure, click **GET IT NOW**

In Azure Portal, click **Create**.

<img src="./media/image1.png" width="559" height="930" />

Azure Portal dialog

In the **Set up basic settings** tab:

<img src="./media/image2.png" width="559" height="864" />

Set up basic settings

-   Provide a name to your Jenkin instance.

-   Select a VM disk type.

-   Username: must meet length requirements, and must not include reserved words or unsupported characters. Name like "admin" is not allowed.

-   Authentication type: Secure an instance by a password or [SSH public key](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/ssh-from-windows). If you use a password, note that it must have 3 of the following: 1 lowercase character, 1 uppercase character, 1 number and 1 special character.

-   Select a subscription.

-   Create a new resource group or use an existing one.

-   Select a location.

In the **Configure additional options** tab:

<img src="./media/image3.png" width="559" height="367" />

Set up additional options

-   Provide a domain name label

Click **OK** to go to the next step.

Once validation passed, click **OK** to download the template and parameters.

Next, select **Purchase** to provision all the resources.

Setup SSH port forwarding
-------------------------

By default, the Jenkins instance is using the HTTP protocol and listens on port 8080. Users should not authenticate over unsecured protocols.

You need to setup port forwarding to view the Jenkins UI on your local machine.

### If you are using Windows:

Install Putty and run this command if you use a password to secure Jenkins:

    putty.exe -ssh -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com

-   Enter the password to log in.

<img src="./media/image4.png" width="559" height="95" />

Enter password to login

If you use SSH, run this command:

    putty -i <private key file including path> -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com

### If you are using Linux or Mac:

If you use a password to secure your Jenkins master, run this command:

    ssh -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com

-   Enter the password to log in.

If you use SSH, run this command:

    ssh -i <private key file including path> -L 8080:localhost:8080 <username>@<Domain name label>.<location>.cloudapp.azure.com

Connect to Jenkins
------------------

After you have started your tunnel, navigate to http://localhost:8080/ on your local machine.

You must unlock the Jenkins dashboard for the first time with the initial admin password.

<img src="./media/image5.png" width="559" height="436" />

Unlock Jenkins

To get a token, SSH into the VM and run `sud``o`` ``cat /var/lib/``J``enkins``/secrets/initialAdminPassword`.

<img src="./media/image6.png" width="559" height="351" />

Unlock Jenkins

You are asked to install the suggested plugins.

<img src="./media/image7.png" width="559" height="438" />

Install plugins

Next, create an admin user for your Jenkins master.

Your Jenkins instance is now ready to use! You can access a read-only view by navigating to <b>http://&lt;public DNS name of the instance you just created>.</b>

<img src="./media/image8.png" width="559" height="437" />

Jenkins is ready!

Next Steps
----------

> \[!div class="nextstepaction"\]\[Azure VMs as Jenkins agents\](jenkins-azure-vm-agents.md)

# Enabling Remote Desktop in Windows Azure

Remote Desktop enables you to access the desktop of a role instance
running in Windows Azure. You can use a remote desktop connection to
configure the virtual machine or troubleshoot problems with your
application.

This task includes the following steps:

-   [Step 1: Create a self-signed PFX certificate][]
-   [Step 2: Modify the service definition and configuration files][]
-   [Step 3: Upload the deployment package and certificate][]
-   [Step 4: Connect to the role instance][]

## <a name="step1"> </a>Step 1: Create a self-signed PFX certificate

To use Remote Desktop, you need to create a self-signed Personal
Information Exchange (PFX) certificate that is used to authenticate you
to the role instance. This certificate is uploaded to Windows Azure with
your deployment, and any computer that you use to access the deployment
remotely must have the certificate installed.

Perform the following steps on the computer you want to use to access
the role instance remotely, such as your development computer with the
Windows Azure SDK installed.

1.  From the **Start** menu, type **inetmgr** and press **Enter**. The
    Internet Information Services (IIS) Manager snap-in appears.

2.  In the **IIS** section, click **Server Certificates**.

    ![][0]

3.  On the **Actions** menu on the right, click **Create Self-Signed
    Certificate**.

    ![][1]

4.  In the **Create Self-Signed Certificate** dialog box, enter a name
    for your certificate, and then click **OK**.

    ![][2]

5.  The new certificate appears in the list of certificates. Click the
    new certificate, and then click **Export**.

    ![][3]

6.  In the **Export Certificate** dialog box, choose an export location,
    a password for the certificate, and then click **OK**.

    ![][4]

When these steps have been completed, the resulting PFX certificate can
be uploaded to Windows Azure.

## <a name="step2"> </a>Step 2: Modify the service definition and configuration files

Now that your certificate has been created, you need to configure the
service definition and service configuration files to use it. The
service definition file must be updated to import the **Remote Access**
and **Remote Forwarder** modules, and the service configuration file
must be updated to include the thumbprint of the certificate.

1.  If your service definition file does not already include the
    **Imports** section, add it within the **WebRole** element. Then,
    add the following modules to the **Imports** section:

        <Imports>
        	<Import moduleName="RemoteAccess"/>
        	<Import moduleName="RemoteForwarder"/>
        </Imports>

2.  In your service configuration file, add the following two settings
    within the **ConfigurationSettings** section:

        <Role name=�Deployment>
        <ConfigurationSettings>
             		<Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="" />
              		<Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="" />
        </ConfigurationSettings>
        ...
        </Role>

3.  The service configuration file also requires the thumbprint of the
    .pfx certificate you created earlier. Add a certificate entry to the
    `<Certificates>` section as shown, replacing the sample thumbprint
    value below with your own:

        <Role name="Deployment>
        	...
        <Certificates>
              		<Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="?9427befa18ec6865a9ebdc79d4c38de50e6316ff" thumbprintAlgorithm="sha1" />
            	</Certificates>
        </Role>

4.  Now that the service definition and service configuration files have
    been updated, package your deployment for uploading to Windows
    Azure. If you are using **cspack**, ensure that you don't use the
    **/generateConfigurationFile** flag, as that will overwrite the
    certificate information you just inserted.

Now that you've updated your package with information about the
certificate, the next step is to upload the package and certificate to
Windows Azure.

## <a name="step3"> </a>Step 3: Upload the deployment package and certificate

Your certificate has been created and your package has been updated to
use the certificate. Now you must upload the package and certificate to
Windows Azure with the Management Portal.

1.  Log on to the [Windows Azure Management Portal][].

2.  Click **New Hosted Service**, add the required information about
    your hosted service, and then click **Add Certificate**.

    ![][5]

3.  In the **Upload Certificates** dialog box, enter the location for
    the PFX certificate you created earlier, the password for the
    certificate, and then click **OK**.

    ![][6]

4.  Click **OK** to create your hosted service. When the deployment has
    reached the **Ready** status, you can proceed to the next steps.

You have now deployed the application in a hosted service and uploaded
the certificate that Windows Azure will use to authorize remote
connections.

## <a name="step4"> </a>Step 4: Connect to the role instance

With your deployment up and running in Windows Azure, you need to enable
remote access, then connect to the role instance.

1.  In the Management Portal, select the role in the deployment that you
    configured for remote access, and then click the **Enable** check
    box in the **Remote Access** area of the portal ribbon.

    ![][7]

2.  In the Set Remote Desktop Credentials dialog box, enter the username
    and password for the Remote Desktop Connection when accessing a
    deployment instance. Select the certificate you uploaded when you
    created the hosted service earlier, set the desired expiration time,
    and then click **OK**.

    It may take a few seconds to enable Remote Desktop for the
    deployment; during this time its status is **Updating**.

    ![][8]

3.  When the deployment status is **Ready**, select an instance of the
    deployment, and then click **Connect** in the **Remote Access** area
    of the portal ribbon.

    ![][9]

4.  When you click **Connect**, the web browser prompts you to save an
    .rdp file. If you're using Internet Explorer, click **Open**.

    ![][10]

5.  When the file is opened, a security prompt appears. Click
    **Connect**.

    ![][11]

6.  Click **Connect**, and a security prompt will appear for entering
    credentials to access the instance. Enter the password for the
    account you created, and then click **OK**.

    ![][12]

When the connection is made, Remote Desktop Connection displays the
desktop of the instance in Windows Azure. You have successfully gained
remote access to your instance and can perform any necessary tasks to
manage your application.

![][13]

## Additional Resources

-   [Remotely Accessing Role Instances in Windows Azure][]
-   [Using Remote Desktop with Windows Azure Roles][]

  [Step 1: Create a self-signed PFX certificate]: #step1
  [Step 2: Modify the service definition and configuration files]: #step2
  [Step 3: Upload the deployment package and certificate]: #step3
  [Step 4: Connect to the role instance]: #step4
  [0]: ../../../DevCenter/Shared/Media/remote-desktop-01.png
  [1]: ../../../DevCenter/Shared/Media/remote-desktop-02.png
  [2]: ../../../DevCenter/Shared/Media/remote-desktop-03.png
  [3]: ../../../DevCenter/Shared/Media/remote-desktop-04.png
  [4]: ../../../DevCenter/Shared/Media/remote-desktop-05.png
  [Windows Azure Management Portal]: http://windows.azure.com/
  [5]: ../../../DevCenter/Shared/Media/remote-desktop-06.png
  [6]: ../../../DevCenter/Shared/Media/remote-desktop-07.png
  [7]: ../../../DevCenter/Shared/Media/remote-desktop-08.png
  [8]: ../../../DevCenter/Shared/Media/remote-desktop-09.png
  [9]: ../../../DevCenter/Shared/Media/remote-desktop-10.png
  [10]: ../../../DevCenter/Shared/Media/remote-desktop-11.png
  [11]: ../../../DevCenter/Shared/Media/remote-desktop-12.png
  [12]: ../../../DevCenter/Shared/Media/remote-desktop-13.png
  [13]: ../../../DevCenter/Shared/Media/remote-desktop-14.png
  [Remotely Accessing Role Instances in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh124107.aspx
  [Using Remote Desktop with Windows Azure Roles]: http://msdn.microsoft.com/en-us/library/windowsazure/gg443832.aspx

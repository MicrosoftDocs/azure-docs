<properties umbraconavihide="1" pagetitle="Windows Azure on Windows 8" metakeywords="Installing the Windows Azure SDK on Windows 8" metadescription="Describes how to install the Windows Azure SDK on Windows 8." linkid="dev-net-windows8" urldisplayname="Windows Azure Install Windows 8" headerexpose footerexpose disquscomments="1"></properties>

# Installing the Windows Azure SDK on Windows 8

You can develop Windows Azure applications on Windows 8 by manually
installing and configuring your development environment. The Windows
Azure all-in-one installer is not yet supported on Windows 8. The steps
below describe how to set up your Windows 8 system for Windows Azure
development.

**Note:** For details about how to install the Windows Azure SDK for
development with Visual Studio on Windows 8, see [Installing the Windows
Azure SDK for .NET on a Developer Machine with Visual Studio 2010 and
Visual Studio 11][]

Please check back for updates, or [subscribe to the Windows Azure
newsletter][] for notification when an update becomes available.

-   [Installation on Windows 8][]
-   [Known Limitations and Issues][]
-   [Support][]

## <a name="Windows8"> </a>Installation on Windows 8

These steps will prepare a development environment for Windows 8. If you
have previouslly followed the manual install steps on the [download
center page for Windows Azure SDK - November 2011][], you will notice
that the install steps for Windows 8 closely resemble these steps. It's
important to follow the steps in order and pay attention to differences
around IIS and the .NET Framework.

Follow these steps to install the tools and configure the environment:

1.  Install [Windows 8][].

2.  Open the Windows Feature configuration settings.

    1.  Press the **Windows logo** key to show the **Start** area in the
        Windows shell.
    2.  Type **Windows Feature** to show search results.
    3.  Select **Settings**.
    4.  Select **Turn Windows features on or off**.

3.  Enable the following features:

    <table border="1" cellspacing="0" cellpadding="10" style="border: 0px solid #000000;">
    <tbody>
    <tr>
    <td valign="top">
    1.  .NET Framework 3.5 (includes .NET 2.0 and 3.0)
        -   Windows Communication Foundation HTTP Activation

    2.  .NET Framework 4.5 Advanced Services
        -   ASP.NET 4.5
        -   WCF Services -\>
            -   HTTP Activation
            -   TCP Port Sharing

    3.  Internet Information Services
        -   Web Management Tools -\> IIS Management Console
        -   World Wide Web Services -\>
            -   Application Development Features -\>
                -   .NET Extensibility 3.5
                -   .NET Extensibility 4.5
                -   ASP.NET 3.5
                -   ASP.NET 4.5
                -   ISAPI Extensions
                -   ISAPT Filters

            -   Common HTTP Features -\>
                -   Default Directory
                -   Directory Browsing
                -   HTTP Errors
                -   HTTP Redirection
                -   Static Content

            -   Health and Diagnostics -\>
                -   Logging Tools
                -   Request Monitor
                -   Tracing

            -   Security -\> Request Filtering

    </td>
    <td>
    ![Windows feature configuration settings required for Windows Azure
    SDK][]

    </td>
    </tr>
    </tbody>
    </table>
4.  Install [SQL Server 2008 R2 Express with SP1][].

    -   It is helpful to install the server with tools. This installer
        is identified by the WT suffix.
        -   Choose SQLEXPRWT\_x64\_ENU.exe or SQLEXPRWT\_x86\_ENU.exe.
        -   Choose **New Installation or Add Features**.
        -   Use the default install options.

5.  Uninstall any existing versions of the Windows Azure SDK for .NET on
    the machine.

6.  Download and install the Windows Azure SDK for .NET - November 2011
    individual components from the [download center page for Windows
    Azure SDK - November 2011][]. (Note that the all-in-one installer
    available from the Windows Azure .NET Developer will not work in
    this scenario.) Choose the correct list below based on your
    platform, and install the components in the order listed:

    -   32-bit:
        -   WindowsAzureEmulator-x86.exe
        -   WindowsAzureSDK-x86.exe
        -   WindowsAzureLibsForNet-x86.msi
        -   WindowsAzureTools.VS100.exe

    -   64-bit:
        -   WindowsAzureEmulator-x64.exe
        -   WindowsAzureSDK-x64.exe
        -   WindowsAzureLibsForNet-x64.msi
        -   WindowsAzureTools.VS100.exe

## <a name="Limitations"> </a>Known Limitations and Issues

-   Windows Azure .NET applications must only target the .NET Framework
    3.5 or 4.0. .NET Framework 4.5 development is currently unsupported
    for Windows Azure applications.

-   The all-in-one Web Platform Installer will not install the Windows
    Azure SDK on Windows 8.

-   You will need to install and leverage SQL Server Express to enable
    your project to run on the Windows Azure compute emulator. Install
    SQL Server R2 Express with SP1 as described in the steps above. If
    SQL Server Express is already installed, run DSINIT from an elevated
    Windows Azure command prompt to reinitialize the emulator on SQL
    Server Express.

## <a name="Support"> </a>Support

For support and questions about the Windows Azure SDK, visit the
[Windows Azure online forums][].

  [Installing the Windows Azure SDK for .NET on a Developer Machine with
  Visual Studio 2010 and Visual Studio 11]: http://www.windowsazure.com/en-us/develop/vs11/
  [subscribe to the Windows Azure newsletter]: https://profile.microsoft.com/RegSysProfileCenter/wizardnp.aspx?wizid=b0db3564-180e-4527-9d92-65421e0d4185
  [Installation on Windows 8]: #Windows8
  [Known Limitations and Issues]: #Limitations
  [Support]: #Support
  [download center page for Windows Azure SDK - November 2011]: http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=28045
  [Windows 8]: http://go.microsoft.com/fwlink/?LinkId=243227
  [Windows feature configuration settings required for Windows Azure
  SDK]: /media/net/win8AzureIIS-Full.png
  [SQL Server 2008 R2 Express with SP1]: http://www.microsoft.com/download/en/details.aspx?id=26729
  [Windows Azure online forums]: http://www.windowsazure.com/en-us/support/forums/

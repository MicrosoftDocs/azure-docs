<properties
umbracoNaviHide=1
pageTitle=Windows Azure on Windows 8
metaKeywords=Installing the Windows Azure SDK on Windows 8
metaDescription=Describes how to install the Windows Azure SDK on Windows 8.
linkid=dev-net-windows8
urlDisplayName=Windows Azure Install Windows 8
headerExpose=
footerExpose=
disqusComments=1
/>
<h1>Installing the Windows Azure SDK on Windows 8</h1>
<p>You can develop Windows Azure applications on Windows 8 by manually installing and configuring your development environment. The Windows Azure all-in-one installer is not yet supported on Windows 8. The steps below describe how to set up your Windows 8 system for Windows Azure development.</p>
<p><strong>Note:</strong> For details about how to install the Windows Azure SDK for development with Visual Studio on Windows 8, see <a href="http://www.windowsazure.com/en-us/develop/vs11/">Installing the Windows Azure SDK for .NET on a Developer Machine with Visual Studio 2010 and Visual Studio 11</a></p>
<p>Please check back for updates, or <a href="https://profile.microsoft.com/RegSysProfileCenter/wizardnp.aspx?wizid=b0db3564-180e-4527-9d92-65421e0d4185">subscribe to the Windows Azure newsletter</a> for notification when an update becomes available.</p>
<ul>
<li><a href="#Windows8">Installation on Windows 8</a></li>
<li><a href="#Limitations">Known Limitations and Issues</a></li>
<li><a href="#Support">Support</a></li>
</ul>
<h2><a name="Windows8"></a>Installation on Windows 8</h2>
<p>These steps will prepare a development environment for Windows 8. If you have previouslly followed the manual install steps on the <a href="http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=28045">download center page for Windows Azure SDK - November 2011</a>, you will notice that the install steps for Windows 8 closely resemble these steps. It's important to follow the steps in order and pay attention to differences around IIS and the .NET Framework.</p>
<p>Follow these steps to install the tools and configure the environment:</p>
<ol>
<li>
<p>Install <a href="http://go.microsoft.com/fwlink/?LinkId=243227">Windows 8</a>.</p>
</li>
<li>
<p>Open the Windows Feature configuration settings.</p>
<ol>
<li>Press the <strong>Windows logo</strong> key to show the <strong>Start</strong> area in the Windows shell.</li>
<li>Type <strong>Windows Feature</strong> to show search results.</li>
<li>Select <strong>Settings</strong>.</li>
<li>Select <strong>Turn Windows features on or off</strong>.</li>
</ol></li>
<li>
<p>Enable the following features:</p>
<table border="1" cellspacing="0" cellpadding="10" style="border: 0px solid #000000;">
<tbody>
<tr>
<td valign="top"><ol>
<li>.NET Framework 3.5 (includes .NET 2.0 and 3.0)
<ul>
<li>Windows Communication Foundation HTTP Activation</li>
</ul>
</li>
<li>.NET Framework 4.5 Advanced Services
<ul>
<li>ASP.NET 4.5</li>
<li>WCF Services -&gt;
<ul>
<li>HTTP Activation</li>
<li>TCP Port Sharing</li>
</ul>
</li>
</ul>
</li>
<li>Internet Information Services
<ul>
<li>Web Management Tools -&gt; IIS Management Console</li>
<li>World Wide Web Services -&gt;
<ul>
<li>Application Development Features -&gt;
<ul>
<li>.NET Extensibility 3.5</li>
<li>.NET Extensibility 4.5</li>
<li>ASP.NET 3.5</li>
<li>ASP.NET 4.5</li>
<li>ISAPI Extensions</li>
<li>ISAPT Filters</li>
</ul>
</li>
<li>Common HTTP Features -&gt;
<ul>
<li>Default Directory</li>
<li>Directory Browsing</li>
<li>HTTP Errors</li>
<li>HTTP Redirection</li>
<li>Static Content</li>
</ul>
</li>
<li>Health and Diagnostics -&gt;
<ul>
<li>Logging Tools</li>
<li>Request Monitor</li>
<li>Tracing</li>
</ul>
</li>
<li>Security -&gt; Request Filtering</li>
</ul>
</li>
</ul>
</li>
</ol></td>
<td><img src="/media/net/win8AzureIIS-Full.png" alt="Windows feature configuration settings required for Windows Azure SDK"/></td>
</tr>
</tbody>
</table>
</li>
<li>
<p>Install <a href="http://www.microsoft.com/download/en/details.aspx?id=26729">SQL Server 2008 R2 Express with SP1</a>.</p>
<ul>
<li>It is helpful to install the server with tools. This installer is identified by the WT suffix.
<ul>
<li>Choose SQLEXPRWT_x64_ENU.exe or SQLEXPRWT_x86_ENU.exe.</li>
<li>Choose <strong>New Installation or Add Features</strong>.</li>
<li>Use the default install options.</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Uninstall any existing versions of the Windows Azure SDK for .NET on the machine.</p>
</li>
<li>
<p>Download and install the Windows Azure SDK for .NET - November 2011 individual components from the <a href="http://www.microsoft.com/download/en/details.aspx?displaylang=en&amp;id=28045">download center page for Windows Azure SDK - November 2011</a>. (Note that the all-in-one installer available from the Windows Azure .NET Developer will not work in this scenario.) Choose the correct list below based on your platform, and install the components in the order listed:</p>
<ul>
<li>32-bit:
<ul>
<li>WindowsAzureEmulator-x86.exe</li>
<li>WindowsAzureSDK-x86.exe</li>
<li>WindowsAzureLibsForNet-x86.msi</li>
<li>WindowsAzureTools.VS100.exe</li>
</ul>
</li>
<li>64-bit:
<ul>
<li>WindowsAzureEmulator-x64.exe</li>
<li>WindowsAzureSDK-x64.exe</li>
<li>WindowsAzureLibsForNet-x64.msi</li>
<li>WindowsAzureTools.VS100.exe</li>
</ul>
</li>
</ul>
</li>
</ol>
<h2><a name="Limitations"></a>Known Limitations and Issues</h2>
<ul>
<li>
<p>Windows Azure .NET applications must only target the .NET Framework 3.5 or 4.0. .NET Framework 4.5 development is currently unsupported for Windows Azure applications.</p>
</li>
<li>
<p>The all-in-one Web Platform Installer will not install the Windows Azure SDK on Windows 8.</p>
</li>
<li>
<p>You will need to install and leverage SQL Server Express to enable your project to run on the Windows Azure compute emulator. Install SQL Server R2 Express with SP1 as described in the steps above. If SQL Server Express is already installed, run DSINIT from an elevated Windows Azure command prompt to reinitialize the emulator on SQL Server Express.</p>
</li>
</ul>
<h2><a name="Support"></a>Support</h2>
<p>For support and questions about the Windows Azure SDK, visit the <a href="http://www.windowsazure.com/en-us/support/forums/">Windows Azure online forums</a>.</p>
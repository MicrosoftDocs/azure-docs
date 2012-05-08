# Deploying and Updating Windows Azure Applications

This article describes the various ways that you can deploy and update
Windows Azure applications. To fully understand this article, you should
read the [Windows Azure Application Model][] article
first.<a id="compare" name="compare"></a>

## Table of Contents<a id="_GoBack" name="_GoBack"></a>

-   [Benefits of the Windows Azure Deployment Model][]
-   [Lifecycle of a Windows Azure Application][]
-   [Scenario \#1: New Deployment][]
-   [Scenario \#2: Configuration Change][]
-   [Scenario \#3: Incremental Code Upgrade][]
-   [Scenario \#4: Major Upgrade][]
-   [References][]

<a name="benefits"> </a>

## Benefits of the Windows Azure Deployment Model

In a traditional server hosting model, when you deploy an application to
a host, you have to worry about patching the operating system (OS),
various components, and your application code itself. In addition, you
need to concern yourself with how to perform these updates with minimal
downtime to your application so that it remains responsive to client
requests. Windows Azure handles deployment and update issues like these
automatically.

Getting your application up and running on Windows Azure is easy. You
simply package (zip) your application and upload it to Windows Azure
along with some XML configuration files. Based on the configuration
information, Windows Azure determines how many role instances (these are
essentially virtual machines or VMs) to provision for each role,
determines what OS version and components to put on each role instance,
installs your uploaded code on each role instance, and boots them. In
most cases, the role instances are up and running your code within
minutes. Once initialized, the role instances report into the load
balancer, which will now distribute client traffic equally to all the
role instances running your Internet-facing application.

Once your role instances (that is, VMs running your application code)
are up and running, Windows Azure constantly monitors them to ensure
high availability of your applications. If one of your application
processes terminates due to an unhandled exception, Windows Azure
automatically restarts your application process on the role instance. If
the hardware that is running your role instance experiences a failure,
Windows Azure detects this, automatically provisions a new role
instance, and boots it on other hardware, again ensuring high
availability for your application. Because it takes a few minutes for
Windows Azure to detect the failing hardware and to provision a new role
instance on other hardware, it is highly recommended that you configure
your application to run at least two role instances for each unit of
code you have running. This way, if one role instance experiences a
problem, the load balancer directs requests to the other role instance,
ensuring that clients can still reach your application.

In fact, if you examine the [Windows Azure Service Level Agreement][],
you will come across the following text related to the compute services:

We guarantee that when you deploy two or more role instances in
different fault and upgrade domains your Internet facing roles will have
external connectivity at least 99.95% of the time. Additionally, we will
monitor all of your individual role instances and guarantee that 99.9%
of the time we will detect when a role instance’s process is not running
and initiate corrective action.

While your application is running, Windows Azure ensures that the OS and
components are patched periodically with minimal downtime to your
applications. Windows Azure also offers ways to scale your application
up or down, to change certificates, endpoints, configuration settings,
and even to version the code for your application with little or no
downtime. This article delves into all the possible deployment and
update scenarios.

<a name="lifecycle"> </a>

## Lifecycle of a Windows Azure Application

Once you have deployed your application to Windows Azure, you have many
ways to manage it and the role instances on which it is running. For
example, you can easily scale the number of instances for any given role
up or down in order to meet business needs. You can also change
configuration settings and distribute the changes out to the role
instances without having to redeploy any of the code. If you discover a
bug or want to add a small feature to your role code, you can upload the
new code to Windows Azure and have it distribute it to the appropriate
role instances. Windows Azure does this while ensuring that your
application remains accessible to your customers; the details of how it
does this are described later in this article.

Finally, if you want to make significant changes to your code, Windows
Azure offers a way for you to upload the new code and test it in a
staging area while customers access the old code. Then, once you feel
confident with the new code, you can move it from staging to production
so that new client requests now run against the new code.

The following sections describe how to perform these scenarios in
detail.

<a name="scenario1"> </a>

## Scenario \#1: New Deployment

To deploy an application to Windows Azure, you must first create a
*hosted service*. You can do so via the Windows Azure Management Portal,
via the [Create Hosted Service REST API][], or automatically from
Windows Azure tooling when deploying your application. Both the Visual
Studio tooling in the Windows Azure SDK for .NET and the command line
tooling in the Windows Azure SDK for Node.js support creating hosted
services. A hosted service allows you to select one of the six Windows
Azure data centers around the world where your applications will be
deployed, and also allows you to reserve a DNS prefix that clients will
use to access your services. The full DNS name will be something like
*prefix*.cloudapp.net. Of course, you can create a DNS record that maps
your custom domain name to the Windows Azure DNS name. For more
information, see the [Windows Azure Application Model][] article.

Before you can deploy an application into the hosted service, you must
package (zip) your application for your roles together into a CSPKG
file. Your service definition (CSDEF) file must also be embedded into
the CSPKG file. In addition, you need to have your service configuration
(CSCFG) file ready. These files are discussed in the [Windows Azure
Application Model][] article. Then, you upload these files to Windows
Azure via the Windows Azure Management Portal or by calling the [Create
Deployment REST API][]. You can alternatively deploy your application
directly from Windows Azure tooling, such as the Visual Studio tooling
in the Windows Azure SDK for .NET or the command line tooling in the
Windows Azure SDK for Node.js. With the tooling, the underlying details
of creating a CSPKG and uploading it to Windows Azure are handled for
you automatically.

Within a few minutes after uploading the files, Windows Azure provisions
your role instances and your application is up and running. The figure
below shows the CSPKG and CSCFG files that you create on your
development computer. The CSPKG file contains the CSDEF file and the
code for two roles. After uploading the CSPKG and CSCFG files to Windows
Azure via the Service Management API, Windows Azure creates the role
instances in the data center. In this example, the CSCFG file indicates
that Windows Azure should create three instances of role \#1 and two
instances of role \#2.<a id="AzureStorage" name="AzureStorage"></a>

![[image]][]

<a name="scenario2"> </a>

## Scenario \#2: Configuration Change

Once an application is deployed and running, you can reconfigure the
roles by modifying the CSCFG file in use. You can edit the CSCFG file
directly using the Windows Azure Management Portal or you can upload a
new CSCFG file via the Windows Azure Management Portal or by calling the
[Change Deployment Configuration REST API][].

The most common reason to change the CSCFG file is to change the number
of instances running a particular role. However, you can also change
configuration setting values or certificates used by a role. If you opt
out of automatic OS updates, you can also change the OS version used by
all the roles. For more information about OS updates, see [Managing
Upgrades to the Windows Azure Guest OS][].

When scaling a role’s instances, Windows Azure adjusts the number of
role instances running each role’s code. Increasing the number of
instances for a role does not impact the currently running instances. If
you decrease the number of instances for a role, then Windows Azure
selects which instances to terminate. Note that instances being
terminated are given a chance to shut down cleanly allowing them to save
any data on the role instance out to more persistent storage such as SQL
Azure, Blobs, or Tables.

In the figure below, a new CSCFG file is uploaded to Windows Azure,
indicating that role \#1 should have two instances and role \#2 should
have one instance. Windows Azure then terminates one instance of each
role.

![[image]][1]

When changing configuration setting values, the applications on the role
instances may have to restart in order to pick up the new configuration
values. Windows Azure restarts the role instances using the in-place
rolling upgrade technique described earlier. More details about this
technique are also discussed in the next
section.<a id="Blob" name="Blob"></a>

<a name="scenario3"> </a>

## Scenario \#3: Incremental Code Upgrade

If you want to make an incremental code upgrade to a role — for example,
to fix a bug or add a small feature — you can create a new CSPKG file
containing the new code and upload it to Windows Azure via the Windows
Azure Management Portal or by calling the [Upgrade Deployment REST
API][]. You can alternatively deploy your application directly from
Windows Azure tooling, such as the Visual Studio tooling in the Windows
Azure SDK for .NET or the command line tooling in the Windows Azure SDK
for Node.js. With the tooling, the underlying details of creating a
CSPKG and uploading it to Windows Azure are handled for you
automatically.

Uploading a new CSPKG file causes Windows Azure to replace the code on
just the instances running the role whose code you modified by
performing an *in-place upgrade*. This means that Windows Azure will
stop some of the instances running the old version of the code, upgrade
the instances with the new version of the code (extracted from the CSPKG
file), and then restart the instances. Once the instances running the
new code have been up and running successfully (considered healthy) for
approximately 15 minutes, Windows Azure will perform the same upgrade on
some of the other instances still running the old version of the code.
It will continue to do this until all instances are running the new
version of the code. An in-place upgrade ensures that your application
always has some instances available to process client requests. This
also means that your application will have some instances running old
versions of your code and new versions of your code simultaneously and
you must ensure that your application code can handle this successfully.

To ensure that all instances running a role are not down simultaneously,
Windows Azure uses *upgrade domains (UDs)*. By default, an application
has five upgrade domains, and Windows Azure will distribute role
instances across all of these upgrade domains. For example, if you have
two instances running a web role and three instances running a worker
role, then Windows Azure will automatically distribute the instances
across the upgrade domains as shown in the table below:

<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
<tbody>
<tr align="left" valign="top">
<td>
**UD \#0**

</td>
<td>
**UD \#1**

</td>
<td>
**UD \#2**

</td>
<td>
**UD \#3**

</td>
<td>
**UD \#4**

</td>
</tr>
<tr align="left" valign="top">
<td>
Web role  
Instance \#1

</td>
<td>
Web role  
Instance \#2

</td>
<td>
(n/a)

</td>
<td>
(n/a)

</td>
<td>
(n/a)

</td>
</tr>
<tr align="left" valign="top">
<td>
Worker role  
Instance \#1

</td>
<td>
Worker role  
Instance \#2

</td>
<td>
Worker role  
Instance \#3

</td>
<td>
(n/a)

</td>
<td>
(n/a)

</td>
</tr>
</tbody>
</table>
If you upload a CSPKG with new code for both roles, then Windows Azure
will first stop all the instances in UD \#0. While Windows Azure updates
the code on these instances, the load balancer directs client requests
to the other three instances, so your application is never completely
offline. After the instances in UD \#0 have the new code installed, they
are restarted, and the load balancer begins directing traffic to them
again. After the new instances are up and running (healthy) for
approximately 15 minutes, Windows Azure stops the instances in UD \#1,
upgrades their code, and restarts them. Finally, after all the role
instances in UD \#1 have been up and running healthy for 15 minutes,
Windows Azure stops the instance in UD \#2, upgrades its code, and
restarts it.

Because of upgrade domains, you never have a role completely offline
while upgrades are being performed as long as you have at least two
instances running each role’s code. You specify the number of upgrade
domains you want your application to have in its CSDEF file. The minimum
is one (which should be avoided) and the maximum is 20.

If you prefer, instead of having Windows Azure automatically walk each
upgrade domain every 15 minutes, you can manually walk each upgrade
domain. That is, you can upgrade the instances in one upgrade domain and
then see how your new code is performing (perhaps by using Remote
Desktop to access a specific role instance). Then, when you are
satisfied, you can tell Windows Azure to upgrade the next upgrade
domain. If you are unhappy with your code, you can also tell Windows
Azure to roll back the change forcing the instances in the
already-walked upgrade domains to revert back to the previous version of
the code.

<a name="scenario4"> </a>

## Scenario \#4: Major Upgrade

Windows Azure also offers a way for you to make a major new release of
your application without your application incurring any downtime. A
major change is one in which an in-place upgrade won’t work, for example
because your application can’t handle having old versions and new
versions of roles running side-by-side during the time it takes to
upgrade all the upgrade domains. An example of this might be if you were
changing the kinds of roles used within your application.

To perform a major code change, you’d create the new CSPKG file
(containing the new version of your roles’ code) & the corresponding
CSCFG file. Then, you’d deploy these new files into your hosted
service’s staging environment via the Windows Azure Management Portal or
by calling the [Create Deployment REST API][]. You can alternatively
deploy your application directly from Windows Azure tooling, such as the
Visual Studio tooling in the Windows Azure SDK for .NET or the command
line tooling in the Windows Azure SDK for Node.js. With the tooling, the
underlying details of creating a CSPKG and uploading it to Windows Azure
are handled for you automatically.

Windows Azure deploys your new application to a new set of role
instances and Windows Azure assign a globally unique identifier (GUID)
as a special DNS prefix when an application is deployed to the staging
environment. The new version of your application is now up and running
in your desired data center and accessible for you to test at
*guid*.cloudapp.net.

Note that the old version of your application is still publicly
available to clients at the preferred DNS prefix and that you are
charged for the instances that are running your production (old) code as
well as the instances that are running your staging (new) code. The
figure below shows version 1.0 of your application running in the
production environment and version 2.0 running in the staging
environment.

![[image]][2]

Once you have sufficiently tested your new code in staging using
*guid*.cloudapp.net, you tell Windows Azure to put it into production by
performing what is called a *Virtual IP (VIP) Swap*. This causes Windows
Azure to reprogram the load balancer so that it now directs client
traffic sent to *prefix*.cloudapp.net to the instances running the new
version of your code. This means that clients immediately start
accessing the new version of your application and no longer have access
to the old version. Again, clients experience no downtime. The figure
below shows how the load balancer directs traffic after a VIP Swap has
been performed.

![[image]][3]

Note that after you swap the VIPs, the old version of your application
is still running and is now available in the staging environment at
guid.cloudapp.net. While this version is still running, you are still
being charged for the role instances. You can now delete the deployment
containing the old version of your application to reduce charges.
Alternatively, you can keep it running for some time and, if any
problems appear with the new version of your application, you can swap
the VIPs again making the old code accessible to clients while you fix
the new version.<a id="SQLAzure" name="SQLAzure"></a>

<a name="references"> </a>

## References

-   [Deploying a Windows Azure Service][]

-   [Operations on Hosted Services][]

<div style="width: 700px; border-top: solid; margin-top: 5px; padding-top: 5px; border-top-width: 1px;">
*Written by Jeffrey Richter (Wintellect)*

</div>

  [Windows Azure Application Model]: ../application-model/
  [Benefits of the Windows Azure Deployment Model]: #benefits
  [Lifecycle of a Windows Azure Application]: #lifecycle
  [Scenario \#1: New Deployment]: #scenario1
  [Scenario \#2: Configuration Change]: #scenario2
  [Scenario \#3: Incremental Code Upgrade]: #scenario3
  [Scenario \#4: Major Upgrade]: #scenario4
  [References]: #references
  [Windows Azure Service Level Agreement]: http://www.windowsazure.com/en-us/support/sla/
  [Create Hosted Service REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/gg441304.aspx
  [Create Deployment REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/ee460813.aspx
  [[image]]: ../../../DevCenter/Shared/Media/deploying-and%20updating-applications-3.jpg
  [Change Deployment Configuration REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/ee460809.aspx
  [Managing Upgrades to the Windows Azure Guest OS]: http://msdn.microsoft.com/en-us/library/windowsazure/ff729422.aspx
  [1]: ../../../DevCenter/Shared/Media/deploying-and%20updating-applications-4.jpg
  [Upgrade Deployment REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/ee460793.aspx
  [2]: ../../../DevCenter/Shared/Media/deploying-and%20updating-applications-5.jpg
  [3]: ../../../DevCenter/Shared/Media/deploying-and%20updating-applications-6.jpg
  [Deploying a Windows Azure Service]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433027.aspx
  [Operations on Hosted Services]: http://msdn.microsoft.com/en-us/library/windowsazure/ee460812.aspx

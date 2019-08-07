---
ms.date:  11/13/2018
keywords:  dsc,powershell,configuration,composite
title:  Convert Configurations to Composite Resources
---
# Convert Configurations to Composite Resources

> Applies To: Windows PowerShell 5.1

Once you get started authoring configurations
you can very quickly create "scenarios" that manage
groups of settings.
Examples would be:

- create a web server
- create a DNS server
- create a SharePoint server
- configure a SQL cluster
- manage firewall settings
- manage password settings

If you are interested in sharing this work with others,
the best option is to package the configuration as a
[Composite Resource](powershell/dsc/resources/authoringresourcecomposite.md).
This can be challenging if you are thinking about creating a Composite for the first time.

A community maintained solution named
[CompositeResource](https://github.com/microsoft/compositeresource)
has been created to resolve this challenge.

CompositeResource automates the process of creating a new module from your configuration.
You start by
[dot sourcing](https://blogs.technet.microsoft.com/heyscriptingguy/2010/08/10/how-to-reuse-windows-powershell-functions-in-scripts/)
the configuration script on your workstation (or build server)
so it is loaded in memory.
Next, rather than running the configuration to generate a MOF file,
use the function provided by the CompositeResource module to automate a conversion.
This will load the contents of your configuration,
get the list of parameters,
and generate a new module with everything you need.

Once you have generated a module,
you can increment the version and add release notes each time you make changes
and publish it to your own
[PowerShellGet repository](https://kevinmarquette.github.io/2018-03-03-Powershell-Using-a-NuGet-server-for-a-PSRepository/?utm_source=blog&utm_medium=blog&utm_content=psscriptrepo).

Once you have create a composite resource module containing your configuration
(or multiple configurations),
you can use them in the
[Composable Authoring Experience](/azure/automation/compose-configurationwithcompositeresources)
in Azure,
or add them to 
[DSC Configuration scripts](powershell/dsc/resources/configurations.md)
to generate MOF files
and
[upload the MOF files to Azure Automation](/azure/automation/tutorial-configure-servers-desired-state#create-and-upload-a-configuration-to-azure-automation).
Then register your servers from either
[on-premises](/azure/automation/automation-dsc-onboarding#physicalvirtual-windows-machines-on-premises-or-in-a-cloud-other-than-azureaws)
or [in Azure](/azure/automation/automation-dsc-onboarding#azure-virtual-machines)
to pull configurations.
The latest update to the project has also published
[runbooks](https://www.powershellgallery.com/packages?q=DscGallerySamples)
for Azure Automation to automate the process of importing configurations
from the PowerShell Gallery in to your account for use as composite resources.

To try out automating creation of composite resources for DSC, visit the
[PowerShell Gallery](https://www.powershellgallery.com/packages/compositeresource/)
and download the solution or click "Project Site"
to view the
[documentation](https://github.com/microsoft/compositeresource).

## See Also

- [Windows PowerShell Desired State Configuration Overview](powershell/dsc/overview/overview.md)
- [DSC Resources](powershell/dsc/resources/resources.md)
- [Configuring The Local Configuration Manager](powershell/dsc/managing-nodes/metaconfig.md)

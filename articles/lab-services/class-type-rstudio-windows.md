---
title: Set up RStudio lab on Windows
titleSuffix: Azure Lab Services
description: Learn how to set up a lab in Azure Lab Services to teach R using RStudio on Windows.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 04/24/2023
---

# Set up a lab to teach R on Windows with Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a class in Azure Lab Services for teaching R and RStudio.

[R](https://www.r-project.org/about.html) is an open-source language used for statistical computing and graphics.  The R language is used in the statistical analysis of genetics to natural language processing to analyzing financial data.  R provides an [interactive command line](https://cran.r-project.org/doc/manuals/r-release/R-intro.html#Invoking-R-from-the-command-line) experience.  [RStudio](https://www.rstudio.com/products/rstudio/) is an interactive development environment (IDE) available for the R language.  The free version provides code-editing tools, an integrated debugging experience, and package development tools.

This article focuses on using R and RStudio for statistical computing. The [deep learning] (class-type-deep-learning-natural-language-processing.md) and [Python and Jupyter Notebooks](class-type-jupyter-notebook.md)
class types set up RStudio differently.  Each article describes how to use the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) marketplace image, which has many [data science related tools](../machine-learning/data-science-virtual-machine/tools-included.md), including RStudio, pre-installed.


## Prerequisites

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

## Lab configuration

### External resource configuration

Some classes require files, such as large data files, to be stored externally.  See [use external file storage in Azure Lab Services](how-to-attach-external-storage.md) for options and setup instructions.

If you choose to have a shared R Server for the students, the server should be set up before the lab is created.  For more information on how to set up a shared server, see [how to create a lab with a shared resource in Azure Lab Services](how-to-create-a-lab-with-shared-resource.md).  For instructions to create an RStudio Server, see [Download RStudio Server for Debian & Ubuntu](https://www.rstudio.com/products/rstudio/download-server/debian-ubuntu/) and [Accessing RStudio Server Open-Source](https://support.rstudio.com/hc/en-us/articles/200552306-Getting-Started).

If you choose to use any external resources, you’ll need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) with your lab plan.

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md) must be enabled during the creation of your lab plan.  It can't be added later.

### Lab plan settings

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md).  Use the following settings when creating the lab.

| Lab setting | Value and description |
| ------------ | ------------------ |
| Virtual Machine Size | **Small GPU (Compute)** |
| VM image | **Windows 10 Pro** |

## Template configuration
After the template virtual machine is created, perform the following steps to configure the lab:

1. Start the template virtual machine and connect to the machine using RDP.

1. [Install R](https://docs.rstudio.com/resources/install-r/) in the template VM

1. [Install RStudio](https://www.rstudio.com/products/rstudio/download/) in the template VM

### Install R
To install R in the template virtual machine:

1. Download the [latest installer for R for Windows](https://cran.r-project.org/bin/windows/base/release.html).

    For a full list of versions available, see the [R for Windows download page](https://cran.r-project.org/bin/windows/base/).

2. Run the installer.

    1. For the **Select Setup Language** prompt, choose the language you want and select **OK**
    1. On the **Information** page of the installer, read the license agreement.  Select **Next** to accept agreement and continue on.
    1. On the **Select Destination Location** page, accept the default install location and select **Next**.
    1. On the **Select Components** page, optionally uncheck **32-bit files** option.  For more information about running both 32-bit and 62-bit versions of R, see [Can both 32-bit and 64-bit R be installed on the same machine?](https://cran.r-project.org/bin/windows/base/rw-FAQ.html#Can-both-32_002d-and-64_002dbit-R-be-installed-on-the-same-machine_003f) frequently asked question.
    1. On the **Startup options** page, leave startup options as **No (accept defaults)**.  If you want the R graphical user interface (GUI) to use separate windows (SDI) or plain text help, choose **Yes (customize startup)** radio button and change startup options in the following to pages of the wizard.
    1. On the **Select Start Menu Folder** page, select **Next**.
    1. On the **Select Additional Tasks** page, optionally select **Create a desktop shortcut**.  Select **Next**.
    1. On the **Installing** page, wait for the installation to finish.
    1. On the **Completing the R for Windows** page, select **Finish**.

You can also perform the installation of R by using PowerShell. The following code example shows how to install R without the 32-bit component and adds a desktop icon for the latest version of R.  To see a full list of command-line options for the installer, see [setup command-line parameters](https://jrsoftware.org/ishelp/index.php?topic=setupcmdline).

```powershell
#Avoid prompt to setup Internet Explorer if we must parse download page
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Internet Explorer\Main" -Name "DisableFirstRunCustomize" -Value 2

$outputfile = "R-win.exe"

$result = Invoke-WebRequest "https://cran.r-project.org/bin/windows/base/release.html" -OutFile $outputfile -PassThru

#Check if we need to parse the result ourselves, to find the latest version of R
if ($result.StatusCode -eq '200' -and $result.Headers["Content-Type"] -eq 'text/html')
{
    $metaTag = $result.ParsedHtml.Head.children | Where-Object {$_.nodeName -eq 'META'}
    if ($metaTag.content  -match "R-\d+\.\d+\.\d+-win.exe"){
        $outputfile = $Matches.0

        #Download latest version
        Invoke-WebRequest "https://cran.r-project.org/bin/windows/base/$outputfile" -OutFile $outputfile
    }else{
        Write-Error "Unable to find latest version of R installer.  Go to https://cran.r-project.org/bin/windows/base/release.html to download manually."
    }
}

#Install Silently
$installPath = Get-Item -Path $outputfile
Start-Process -FilePath $installPath.FullName -ArgumentList "/VERYSILENT /LOG=r-install.log /NORESTART /COMPONENTS=""main,x64,translations"" /MERGETASKS=""desktopicon"" /LANG=""en""" -NoNewWindow -Wait
```

### Install RStudio

After you install R in the template VM, install the RStudio IDE. In this article, you install the free version of RStudio Desktop. For all available versions, see [RStudio downloads](https://www.rstudio.com/products/rstudio/download/).

1. Download the [installer for R Studio](https://www.rstudio.com/products/rstudio/download/#download) for Windows 10. The installer file is in the format `rstudio-{version}.exe`.

1. Run the RStudio installer.

    1. On the **Welcome to RStudio Setup** page of the **RStudio Setup** wizard, select **Next**.
    1. On the **Choose Install Location** page, select **Next**.
    1. On the **Choose Start Menu Folder** page, select **Install**.
    1. On the **Installing** page, wait for the installation to finish.
    1. On the **Completing RStudio Setup** page, select **Finish**.

To perform the RStudio installation steps by using PowerShell, run the following commands. See [RStudio downloads](https://www.rstudio.com/products/rstudio/download/) to verify the RStudio version is available before executing the commands.

```powershell
$rstudiover="1.4.1717"
$outputfile = "RStudio-$rstudiover.exe"

#Download installer executable
Invoke-WebRequest "https://download1.rstudio.org/desktop/windows/RStudio-$rstudiover.exe" -OutFile $outputfile

#Install RStudio silently
$installPath = Get-Item -Path $outputfile
Start-Process -FilePath $installPath.FullName -ArgumentList "/S" -NoNewWindow -Wait
```

### Install CRAN packages

Comprehensive R Archive Network (CRAN) is R's central software repository. Among others, the repository contains R packages, which you can use to extend your R programs.

To install CRAN packages on the template virtual machine:

- Use the `install.packages(“package name”)` command in an R interactive session as shown in [quick list of useful R packages](https://support.rstudio.com/hc/articles/201057987-Quick-list-of-useful-R-packages) article.

- Alternately, use the **Tools** > **Install Packages** menu item in RStudio.

See the [list of packages by task](https://cran.r-project.org/web/views/) or [alphabetic list of packages](https://cloud.r-project.org/web/packages/available_packages_by_name.html).

## Cost

This section provides a cost estimate for running this class for 25 lab users. There are 20 hours of scheduled class time. Also, each user gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Small GPU (Compute)**, which is 139 lab units.

- 25 lab users &times; (20 scheduled hours + 10 quota hours) &times; 139 lab units

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

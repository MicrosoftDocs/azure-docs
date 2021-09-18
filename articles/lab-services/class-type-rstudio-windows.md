---
title: Set up a lab with R and RStudio on Windows using Azure Lab Services
description: Learn how to set up labs to teach R using RStudio on Windows
author: emaher
ms.topic: article
ms.date: 08/26/2021
ms.author: enewman
---

# Set up a lab to teach R on Windows

[R](https://www.r-project.org/about.html) is an open-source language used for statistical computing and graphics.  It's used in the statistical analysis of genetics to natural language processing to analyzing financial data.  R provides an [interactive command line](https://cran.r-project.org/doc/manuals/r-release/R-intro.html#Invoking-R-from-the-command-line) experience.  [RStudio](https://www.rstudio.com/products/rstudio/) is an interactive development environment (IDE) available for the R language.  The free version provides code editing tools, an integrated debugging experience, and package development tools.

This article will focus on solely RStudio and R as a building block for a class that requires the use of statistical computing.  The [deep learning](class-type-deep-learning-natural-language-processing.md) and [Python and Jupyter Notebooks](class-type-jupyter-notebook.md)
class types setup RStudio differently.  Each article describes how to use the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-US/marketplace/apps/microsoft-dsvm.ubuntu-1804) marketplace image, which has many [data science related tools](../machine-learning/data-science-virtual-machine/tools-included.md), including RStudio, pre-installed.  

## Lab Account configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see the tutorial on [how to setup a lab account](./tutorial-setup-lab-account.md). You can also use an existing lab account.

### Lab account settings

Enable your lab account settings as described in the following table.

| Lab account setting | Instructions |
| -------------------- | ----- |
| [Enable peer virtual network](how-to-connect-peer-virtual-network.md) | Enable if:<ul><li>Class requires a shared R Server.</li><li>Class requires large data files that you want to store externally and not on the student VM.</li></ul> |

> [!IMPORTANT]
> If you choose to enable peer virtual network, this must be done before the lab is created.

## Lab configuration

For instructions to create a new lab and apply the needed settings, see [Tutorial: Set up a classroom lab](tutorial-setup-classroom-lab.md).  When creating the lab, apply the following settings:

| Lab setting | Value and description |
| ------------ | ------------------ |
| Virtual Machine Size | Small GPU (Compute)|
| VM image | Windows 10 Pro. Version 2004 |

## External resource configuration

Some classes require files, such as large data files, to be stored externally.  See [use external file storage in Azure Lab Services](how-to-attach-external-storage.md) for options and setup instructions.

If you choose to have a shared RStudio Server for the students, the server should be set up before the lab is created.  For more information on how to set up a shared server, see [how to create a lab with a shared resource in Azure Lab Services](how-to-create-a-lab-with-shared-resource.md).  For instructions to create an RStudio Server, see [Download RStudio Server for Debian & Ubuntu](https://www.rstudio.com/products/rstudio/download-server/debian-ubuntu/) and [Accessing RStudio Server Open-Source](https://support.rstudio.com/hc/en-us/articles/200552306-Getting-Started).

## Template configuration

After the template machine is created, start the machine, and connect to it to [install R](https://docs.rstudio.com/resources/install-r/) and [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/).  

### Install R

1. Download the [latest installer for R for Windows](https://cran.r-project.org/bin/windows/base/release.html).  For a full list of versions available, see the [R for Windows download page](https://cran.r-project.org/bin/windows/base/).
2. Run the installer.
    1. For the **Select Setup Language** prompt, choose the language you want and select **OK**
    2. On the **Information** page of the installer, read the license agreement.  Select **Next** to accept agreement and continue on.
    3. On the **Select Destination Location** page, accept the default install location and select **Next**.
    4. On the **Select Components** page, optionally uncheck **32-bit files** option.  For more information about running both 32-bit and 62-bit versions of R, see [Can both 32-bit and 64-bit R be installed on the same machine?](https://cran.r-project.org/bin/windows/base/rw-FAQ.html#Can-both-32_002d-and-64_002dbit-R-be-installed-on-the-same-machine_003f) frequently asked question.
    5. On the **Startup options** page, leave startup options as **No (accept defaults)**.  If you want the R graphical user interface (GUI) to use separate windows (SDI) or plain text help, choose **Yes (customize startup)** radio button and change startup options in the following to pages of the wizard.
    6. On the **Select Start Menu Folder** page, select **Next**.
    7. On the **Select Additional Tasks** page, optionally select **Create a desktop shortcut**.  Select **Next**.
    8. On the **Installing** page, wait for the installation to finish.
    9. On the **Completing the R for Windows** page, select **Finish**.

You can also execute the installation of R using PowerShell.  The code example shows how to install R without the 32-bit component and adds a desktop icon for the latest version of R.  To see a full list of command-line options for the installer, see [setup command-line parameters](https://jrsoftware.org/ishelp/index.php?topic=setupcmdline).

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

Now that we have R installed locally, we can install the RStudio IDE.  We'll install the free version of RStudio Desktop.  For all available versions, see [RStudio downloads](https://www.rstudio.com/products/rstudio/download/).

1. Download the [installer for R Studio](https://www.rstudio.com/products/rstudio/download/#download) for Windows 10.  The installer file will be in the format `rstudio-{version}.exe`.  
2. Run the RStudio installer.
    1. On the **Welcome to RStudio Setup** page of the **RStudio Setup** wizard, select **Next**.
    2. On the **Choose Install Location** page, select **Next**.
    3. On the **Choose Start Menu Folder** page, select **Install**.
    4. On the **Installing** page, wait for the installation to finish.
    5. On the **Completing RStudio Setup** page, select **Finish**.

To execute the RStudio installation steps using PowerShell, run the following commands.  See [RStudio downloads](https://www.rstudio.com/products/rstudio/download/) to verify the RStudio version is available before executing the commands.

```powershell
$rstudiover="1.4.1717"
$outputfile = "RStudio-$rstudiover.exe"

#Download installer executable
Invoke-WebRequest "https://download1.rstudio.org/desktop/windows/RStudio-$rstudiover.exe" -OutFile $outputfile

#Install RStudio silently
$installPath = Get-Item -Path $outputfile
Start-Process -FilePath $installPath.FullName -ArgumentList "/S" -NoNewWindow -Wait
```

### CRAN packages

Use the `install.packages(“package name”)` command in an R interactive session as shown in [quick list of useful R packages](https://support.rstudio.com/hc/articles/201057987-Quick-list-of-useful-R-packages) article.  Alternately, use Tools -> Install Packages menu item in RStudio.

If you need help with finding a package, see a [list of packages by task](https://cran.r-project.org/web/views/) or [alphabetic list of packages](https://cloud.r-project.org/web/packages/available_packages_by_name.html).

## Cost

Let’s cover an example cost estimate for this class.  Suppose you have a class of 25 students. Each student has 20 hours of scheduled class time.  Another 10 quota hours for homework or assignments outside of scheduled class time is given to each student.  The virtual machine size we chose was **Small GPU (Compute)**, which is 139 lab units.

25 students &times; (20 scheduled hours + 10 quota hours) &times; 139 Lab Units &times; 0.01 USD per hour = 1042.5 USD

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

The template image can now be published to the lab. See [publish the template VM](how-to-create-manage-template.md#publish-the-template-vm) for further instructions.

As you set up your lab, see the following articles:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quotas](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
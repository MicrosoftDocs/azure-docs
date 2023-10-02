---
title: Set up a lab with R and RStudio on Linux using Azure Lab Services
description: Learn how to set up labs to teach R using RStudio on Linux
ms.topic: how-to
ms.date: 08/25/2021
ms.service: lab-services
---

# Set up a lab to teach R on Linux

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

[R](https://www.r-project.org/about.html) is an open-source language used for statistical computing and graphics.  It's used in the statistical analysis of genetics to natural language processing to analyzing financial data.  R provides an [interactive command line](https://cran.r-project.org/doc/manuals/r-release/R-intro.html#Invoking-R-from-the-command-line) experience.  [RStudio](https://www.rstudio.com/products/rstudio/) is an interactive development environment (IDE) available for the R language.  The free version provides code editing tools, an integrated debugging experience, and package development tools.

This article focuses on solely RStudio and R as a building block for a class that requires the use of statistical computing.  The [deep learning](class-type-deep-learning-natural-language-processing.md) and [Python and Jupyter Notebooks](class-type-jupyter-notebook.md)
class types setup RStudio differently.  Each article describes how to use the [Data Science Virtual Machine for Linux (Ubuntu)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?search=Data%20science%20Virtual%20machine&page=1&filters=microsoft%3Blinux) marketplace image, which has many [data science related tools](../machine-learning/data-science-virtual-machine/tools-included.md), including RStudio, preinstalled.  

## Lab configuration

To set up this lab, you need an Azure subscription and lab plan to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

### External resource configuration

Some classes require files, such as large data files, to be stored externally.  See [use external file storage in Azure Lab Services](how-to-attach-external-storage.md) for options and setup instructions.

If you choose to have a shared R Server for the students, the server should be set up before the lab is created.  For more information on how to set up a shared server, see [how to create a lab with a shared resource in Azure Lab Services](how-to-create-a-lab-with-shared-resource.md).  For instructions to create an RStudio Server, see [Download RStudio Server for Debian & Ubuntu](https://www.rstudio.com/products/rstudio/download-server/debian-ubuntu/) and [Accessing RStudio Server Open-Source](https://support.rstudio.com/hc/en-us/articles/200552306-Getting-Started).

If you choose to use any external resources, you need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) with your lab plan.

> [!IMPORTANT]
> [Advanced networking](how-to-connect-vnet-injection.md) must be enabled during the creation of your lab plan.  It can't be added later.

### Lab plan settings

Once you get have Azure subscription, you can create a new lab plan in Azure Lab Services. For more information about creating a new lab plan, see the tutorial on [how to set up a lab plan](./quick-create-resources.md). You can also use an existing lab plan.

Enable your lab plan settings as described in the following table. For more information about how to enable Azure Marketplace images, see [Specify the Azure Marketplace images available to lab creators](./specify-marketplace-images.md).

| Lab plan setting | Instructions |
| -------------------- | ----- |
| Marketplace images | Enable **Ubuntu Server 18.04 LTS** image. |

### Lab settings

For instructions on how to create a lab, see [Tutorial: Set up a lab](tutorial-setup-lab.md).  Use the following settings when creating the lab.

| Lab setting | Value and description |
| ------------ | ------------------ |
| Virtual Machine Size | Small GPU (Compute)|
| VM image | Ubuntu Server 18.04 LTS |
| Enable remote desktop connection | This setting should be enabled if you choose to use RDP.  This setting isn't needed if you choose [X2Go to connect to lab machines](connect-virtual-machine-linux-x2go.md). |

If you choose to instead use RDP, you need to connect to the Linux VM using SSH and install the RDP and GUI packages before publishing the lab.  Then, students can connect to the Linux VM using RDP later.  For more information, see [Enable graphical remote desktop for Linux VMs](how-to-enable-remote-desktop-linux.md).

## Template configuration

After the template machine is created, start the machine, and connect to it to [install R](https://docs.rstudio.com/resources/install-r/), [RStudio Desktop](https://www.rstudio.com/products/rstudio/download/) and optionally [X2Go Server](https://wiki.x2go.org/doku.php/doc:installation:x2goserver).  

First, let’s update apt and upgrade existing packages on the machine.

```bash
sudo apt update 
sudo apt upgrade
```

### Install X2Go Server

If you choose to use X2Go, [install the server](https://aka.ms/azlabs/scripts/LinuxDesktop).  You first need to [Connect to a Linux lab VM using SSH](connect-virtual-machine.md#connect-to-a-linux-lab-vm-using-ssh) to install the server component.  Once that is completed, the rest of the setup can be completed after [connecting using the X2Go client](connect-virtual-machine-linux-x2go.md).

The default installation of X2Go isn't compatible with RStudio.  To work around this issue, update the x2goagent options file.

1. Edit `/etc/x2go/x2goagent.options` file.  Don’t forget to edit file as sudo.
    1. Uncomment the line that states: `X2GO_NXAGENT_DEFAULT_OPTIONS+=" -extension GLX"`
    1. Comment the line that states: `X2GO_NXAGENT_DEFAULT_OPTIONS+=" -extension GLX"`
2. Restart the X2Go server so the new options are used.

    ```bash
    sudo systemctl restart x2goserver
    ```

Alternatively, you can build the required libraries by following instructions at [GLX workaround for X2Go](https://wiki.x2go.org/doku.php/wiki:development:glx-xlib-workaround).

### Install R

There are a few ways to install R on the VM.  You install R from the Comprehensive R Archive Network (CRAN) repository.  It provides the most up-to-date versions of R.   Once this repository is added to our machine, you can install R and many other related packages.

We need to add the CRAN repository. Commands are modified from instructions available at [Ubuntu Packages for R brief instructions](https://cran.rstudio.com/bin/linux/ubuntu/).

```bash
#download helper packages
sudo apt install --no-install-recommends software-properties-common dirmngr
# download and add the signing key (by Michael Rutter) for these repos
sudo wget -q "https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc" -O /etc/apt/trusted.gpg.d/cran_ubuntu_key.asc
#add repository
sudo add-apt-repository "deb https://cloud.r-project.org/bin/linux/ubuntu bionic-cran40/"
```

Now we can install R, running the following command:

```bash
sudo apt install r-base
```

### Install RStudio

Now that we have R installed locally, we can install the RStudio IDE.  We install the free version of RStudio Desktop.  For all available versions, see [RStudio downloads](https://www.rstudio.com/products/rstudio/download/).

1. [Import the code signing key](https://www.rstudio.com/code-signing/) for RStudio.

    ```bash
    sudo gpg --keyserver keyserver.ubuntu.com  --recv-keys 3F32EE77E331692F
    ```

2. Download the [Debian Linux Package file (.deb) for R Studio](https://www.rstudio.com/products/rstudio/download/#download) for Ubuntu.  File is in the format `rstudio-{version}-amd64.deb`.  For example:

    ```bash
    export rstudiover="1.4.1717"
    wget --quiet -O rstudio.deb https://download1.rstudio.org/desktop/bionic/amd64/rstudio-$rstudiover-amd64.deb
    ```

3. Use gdebi to install RStudio.   Make sure to use the file path to indicate to apt that were installing a local file.

    ```bash
    sudo apt install gdebi-core 
    echo "y" | gdebi rstudio.deb –quiet
    ```

### CRAN packages

Now it’s time to install any [CRAN packages](https://cloud.r-project.org/web/packages/available_packages_by_name.html) you want.  First, add the [current R 4.0 or later ‘c2d4u’ repository](https://cran.rstudio.com/bin/linux/ubuntu/#get-5000-cran-packages).

```bash
sudo add-apt-repository ppa:c2d4u.team/c2d4u4.0+
```

Use the `install.packages(“package name”)` command in an R interactive session as shown in [quick list of useful R packages](https://support.rstudio.com/hc/articles/201057987-Quick-list-of-useful-R-packages) article.  Alternately, use Tools -> Install Packages menu item in RStudio.

If you need help with finding a package, see a [list of packages by task](https://cran.r-project.org/web/views/) or [alphabetic list of packages](https://cloud.r-project.org/web/packages/available_packages_by_name.html).

## Cost

Let’s cover an example cost estimate for this class.  Suppose you have a class of 25 students. Each student has 20 hours of scheduled class time.  Another 10 quota hours for homework or assignments outside of scheduled class time is given to each student.  The virtual machine size we chose was **Small GPU (Compute)**, which is 139 lab units.

25 students &times; (20 scheduled hours + 10 quota hours)  &times; 139 Lab Units &times; 0.01 USD per hour = 1042.5 USD

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]

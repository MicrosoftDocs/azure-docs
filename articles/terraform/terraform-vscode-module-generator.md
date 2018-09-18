---

title: 'Azure Terraform VS Code Module Generator | Microsoft Docs'
description: In this article, learn how to ... in Visual Studio Code.
services: terraform
ms.service: terraform
keywords: terraform, devops, virtual machine, azure
author: v-mavick
manager: jeconnoc
ms.author: v-mavick
ms.topic: tutorial
ms.date: 09/12/2018

---

# Create a Terraform base template using Yeoman module generator

In this article, you learn how to use the Yeoman module generator to create a base template for starting a new Terraform module from within VS Code.

## Prerequisites

- A computer running Windows 10, Linux, or macOS 10.10+.
- [Visual Studio Code](https://www.bing.com/search?q=visual+studio+code+download&form=EDGSPH&mkt=en-us&httpsmsn=1&refig=dffc817cbc4f4cb4b132a8e702cc19a3&sp=3&ghc=1&qs=LS&pq=visual+studio+code&sk=LS1&sc=8-18&cvid=dffc817cbc4f4cb4b132a8e702cc19a3&cc=US&setlang=en-US).
- An active Azure subscription. [Activate a free 30-day trial Microsoft Azure account](https://azure.microsoft.com/free/).
- An installation of the [Terraform](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/terraform-install-configure ) open-source tool on your local machine.
- An installation of [Docker for Windows](https://docs.docker.com/docker-for-windows/install/), or Docker for Linux, or Docker for macOS.
- An installation of the [Go programming language](https://golang.org/).

## Prepare your dev environment

### Install Node.js

To use Terraform in the Cloud Shell, you need to [install Node.js](https://nodejs.org/) 6.0+.

>[!NOTE]
>To verify that Node.js is installed, open a terminal window and enter `node --version`.

### Install Yeoman

From a command prompt, enter `npm install -g yo`

![Install Yeoman](media/terraform-vscode-module-generator/ymg-npm-install-yo.png)

### Install the Yeoman template for Terraform module

From a command prompt, enter `npm install -g generator-az-terra-module`.

![Install generator-az-terra-module](media/terraform-vscode-module-generator/ymg-pm-install-generator-module.png)

>[!NOTE]
>To verify that Yeoman is installed, from a terminal window, enter `yo --version`.

### Create an empty folder to hold the Yeoman-generated module

The Yeoman template generates files in the **current directory**. For this reason, you need to create a new, empty directory.

>[!Note]
>This empty directory is required to be put under $GOPATH/src. You will find instructions [here](https://github.com/golang/go/wiki/SettingGOPATH) to accomplish this.

From a command prompt:

1. Navigate to the parent directory that you want to contain the new, empty directory we are about to create.
1. Enter `mkdir <new directory's name>`.

    >[!NOTE]
    >Replace <new diresctory's name> with the name of your new directory. In this example, we named the new directory `GeneratorDocSample`.

    ![mkdir](media/terraform-vscode-module-generator/ymg-mkdir-GeneratorDocSample.png)

1. Navigate into the new directory by typing `cd <new directory's name>`, and then pressing **enter**.

    ![Navigate to your new directory](media/terraform-vscode-module-generator/ymg-cd-GeneratorDocSample.png)

    >[!NOTE]
    >To make sure this directory is empty, enter `ls`. There should be no files listed in the resulting output of this command.

## Create a base module template

From a command prompt:

1. Enter `yo az-terra-module`.

1. Follow the on-screen instructions to provide the following information:

    - *Terraform module project Name*

        ![Project name](media/terraform-vscode-module-generator/ymg-project-name.png)       

        >[!NOTE]
        >In this example, we entered `doc-sample-module`.

    - *Would you like to include the Docker image file?*

        ![Include Docker image file?](media/terraform-vscode-module-generator/ymg-include-docker-image-file.png) 

        >[!NOTE]
        >Enter `y`. If you select **n**, the generated modue code will support running only in native mode.

3. Enter `ls` to view the resulting files that are created.

    ![List created files](media/terraform-vscode-module-generator/ymg-ls-GeneratorDocSample-files.png)

## Review the generated module code

1. Launch Visual Studio Code

1. From the menu bar, select **File > Open Folder** and select the folder you created.

    ![Visual Studio Code](media/terraform-vscode-module-generator/ymg-open-in-vscode.png)

Let's take a look at some of the files that were created by the Yeoman module generator.

### main.tf

This file defines a module called *random-shuffle*. The input is a *string_list*. The output is the count of the permutations.

### variables.tf

Defines the input and output variables used by the module.

### outputs.tf

Defines what the module outputs. In this case, it is the value returned by **random_shuffle**, which is a built-in, Terraform module.

### Rakefile

Defines the build steps. These steps include:

- **build**: Validates the formatting of the main.tf file.
- **unit**: The generated module skeleton does not include code for a unit test. If you want to specify a unit test scenario, this is where you add that code.
- **e2e**: Runs an end-to-end test of the module.

### test

- Test cases are written in Go.
- All code in *test* are end-to-end tests.
- End-to-end tests try to use Terraform to provision all of the items defined under **fixture** and then compare the output in the **template_output.go** code with the pre-defined expected values.
- **Gopkg.lock** and **Gopkg.toml**: Define your dependencies. 

## Test the module using Docker

>[!NOTE]
>In this example, we are running the module as a local module, and not actually touching Azure.

### Confirm Docker is installed and running

From a command prompt, enter `docker version`.

![DOcker version](media/terraform-vscode-module-generator/ymg-docker-version.png)

This will confirm that Docker is installed.

To confirm that Docker is actually running, enter `docker info`.

![Docker info](media/terraform-vscode-module-generator/ymg-docker-info.png)

### Set up a Docker container

1. From a command prompt, enter

    `docker build --build-arg BUILD_ARM_SUBSCRIPTION_ID= --build-arg BUILD_ARM_CLIENT_ID= --build-arg BUILD_ARM_CLIENT_SECRET= --build-arg BUILD_ARM_TENANT_ID= -t terra-mod-example .`.

    The message **Successfully built** will be displayed.

    ![Successfully built](media/terraform-vscode-module-generator/ymg-successfully-built.png)

1. From the command prompt, enter `docker image ls`.

    You will see your newly created module *terra-mod-example* listed.

    ![Repository results](media/terraform-vscode-module-generator/ymg-repository-results.png)

    >[!NOTE]
    >The module's name, *terra-mod-example*, was specified in the command you entered in step 1, above.

1. Enter `docker run -it terra-mod-example /bin/sh`.

    You are now running in Docker and can list the file by entering `ls`.

    ![List Docker file](media/terraform-vscode-module-generator/ymg-list-docker-file.png)

1. Enter `bundle install`.

    Wait for the **Bundle complete** message, then continue with the next step.

1. Enter `rake build`.

    ![Rake build](media/terraform-vscode-module-generator/ymg-rake-build.png)

### Perform the end-to-end test

1. Enter `rake e2e`.

1. After a few moments, the **PASS** message will appear.

    ![PASS](media/terraform-vscode-module-generator/ymg-pass.png)

1. Enter `exit`. This completes the end-to-end test.

## Next steps

> [!div class="nextstepaction"]
> [Install and use the Azure Terraform Visual Studio Code extenstion.](https://docs.microsoft.com/azure/terraform/terraform-vscode-extension)
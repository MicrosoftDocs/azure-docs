---
title: "Tutorial: Use sdutil to load data into Seismic Store"
titleSuffix: Microsoft Azure Data Manager for Energy
description: This tutorial shows you how to set up and use sdutil, a command-line tool for interacting with Seismic Store.
author: elizabethhalper
ms.author: elhalper
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 09/09/2022
ms.custom: template-tutorial

#Customer intent: As a developer, I want to learn how to use sdutil so that I can load data into Seismic Store.
---

# Tutorial: Use sdutil to load data into Seismic Store

Seismic Store is a cloud-based solution for storing and managing datasets of any size. It provides a secure way to access datasets through a scoped authorization mechanism. Seismic Store overcomes cloud providers' object size limitations by managing generic datasets as multiple independent objects.

Sdutil is a command-line Python tool for interacting with Seismic Store. You can use sdutil to perform basic operations like uploading data to Seismic Store, downloading datasets from Seismic Store, managing users, and listing folder contents.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Set up and run the sdutil tool.
> - Obtain the Seismic Store URI.
> - Create a subproject.
> - Register a user.
> - Use sdutil to manage datasets with Seismic Store.
> - Run tests to validate the sdutil tool's functionalities.

## Prerequisites

Install the following prerequisites based on your operating system.

Windows:

- [64-bit Python 3.8.3](https://www.python.org/ftp/python/3.8.3/python-3.8.3-amd64.exe)
- [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- [Linux Subsystem Ubuntu](/windows/wsl/install)

Linux:

- [64-bit Python 3.8.3](https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz)

Unix/Mac

- [64-bit Python 3.8.3](https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz)
- [Apple Xcode C++ Build Tools](https://developer.apple.com/xcode/cpp)

Sdutil requires other modules noted in `requirements.txt`. You can either install the modules as is or install them in a virtual environment to keep your host clean from package conflicts. If you don't want to install them in a virtual environment, skip the four virtual environment commands in the following code. Additionally, if you're using Mac instead of Ubuntu or WSL - Ubuntu 20.04, either use `homebrew` instead of `apt-get` as your package manager, or manually install `apt-get`.

```bash
  # Check if virtualenv is already installed
  virtualenv --version

  # If not, install it via pip or apt-get
  pip install virtualenv
  # or sudo apt-get install python3-venv for WSL

  # Create a virtual environment for sdutil
  virtualenv sdutilenv
  # or python3 -m venv sdutilenv for WSL

  # Activate the virtual environment
  Windows:    sdutilenv/Scripts/activate  
  Linux:      source sdutilenv/bin/activate
```

Install required dependencies:

```bash
  # Run this from the extracted sdutil folder
  pip install -r requirements.txt
```

## Usage

### Configuration

1. Clone the [sdutil repository](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/home/-/tree/master) from the community `azure-stable` branch and open in your favorite editor.

2. Replace the contents of `config.yaml` in the `sdlib` folder with the following YAML. Fill in the three templatized values (two instances of `<meds-instance-url>` and one instance of `<put refresh token here...>`).

    ```yaml
    seistore:
      service: '{"azure": {"azureGlabEnv":{"url": "https://<meds-instance-url>/seistore-svc/api/v3", "appkey": ""}}}'
      url: 'https://<meds-instance-url>/seistore-svc/api/v3'
      cloud_provider: 'azure'
      env: 'glab'
      auth-mode: 'JWT Token'
      ssl_verify: False
    auth_provider:
      azure: '{
            "provider": "azure",
            "authorize_url": "https://login.microsoftonline.com/",
            "oauth_token_host_end": "/oauth2/token",
            "scope_end":"/.default openid profile offline_access",
            "redirect_uri":"http://localhost:8080",
            "login_grant_type": "refresh_token",
            "refresh_token": "<put refresh token here from auth_token.http authorize request>"
            }'
    azure:
      empty: 'none'
    ```

    > [!NOTE]
    > If a token isn't already present, obtain one by following the directions in [How to generate auth token](how-to-generate-auth-token.md).

3. Export or set the following environment variables:

    ```bash
      export AZURE_TENANT_ID=<your-tenant-id>
      export AZURE_CLIENT_ID=<your-client-id>
      export AZURE_CLIENT_SECRET=<your-client-secret>
    ```

### Running the tool

1. Run the sdutil tool from the extracted utility folder:

    ```bash
      python sdutil
    ```

    If you don't specify any arguments, this menu appears:

    ```code
      Seismic Store Utility

      > python sdutil [command]

      available commands:

      * auth    : authentication utilities
      * unlock  : remove a lock on a seismic store dataset
      * version : print the sdutil version
      * rm      : delete a subproject or a space separated list of datasets
      * mv      : move a dataset in seismic store
      * config  : manage the utility configuration
      * mk      : create a subproject resource
      * cp      : copy data to(upload)/from(download)/in(copy) seismic store
      * stat    : print information like size, creation date, legal tag(admin) for a space separated list of tenants, subprojects or datasets
      * patch   : patch a seismic store subproject or dataset
      * app     : application authorization utilities
      * ls      : list subprojects and datasets
      * user    : user authorization utilities
    ```

2. If this is your first time using the tool, run the `sdutil config init` command to initialize the configuration:

    ```bash
      python sdutil config init
    ```

3. Before you start using the tool and performing any operations, you must sign in to the system. When you run the following command, sdutil opens a sign-in page in a web browser:

    ```bash
      python sdutil auth login
    ```

    After you successfully sign in, your credentials are valid for a week. You don't need to sign in again unless the credentials expire.

    > [!NOTE]
    > If you aren't getting the message about successful sign-in, make sure that your three environment variables are set and that you followed all steps in the [Configuration](#configuration) section earlier in this tutorial.

## Seismic Store resources

Before you start using the system, it's important to understand how Seismic Store manages resources. Seismic Store manages three types of resources:

- **Tenant project**: The main project. The tenant is the first section of the Seismic Store path.
- **Subproject**: The working subproject, which is directly linked under the main tenant project. The subproject is the second section of the Seismic Store path.
- **Dataset**: The dataset entity. The dataset is the third and last section of the Seismic Store path. You can specify the dataset resource by using the form `path/dataset_name`. In that form, `path` is optional and has the same meaning as a directory in a generic file system. The `dataset_name` part is the name of the dataset entity.

The Seismic Store URI is a string that you use to uniquely address a resource in the system. You can obtain it by appending the prefix `sd://` to the required resource path:

```code
  sd://<tenant>/<subproject>/<path>*/<dataset>
```

For example, if you have a `results.segy` dataset stored in the `qadata/ustest` directory structure in the `carbon` subproject under the `gtc` tenant project, the corresponding `sdpath` code is:

```code
  sd://gtc/carbon/qadata/ustest/results.segy
```

You can address every resource by using the corresponding `sdpath` section:

```code
  Tenant: sd://gtc
  Subproject: sd://gtc/carbon
  Dataset: sd://gtc/carbon/qadata/ustest/results.segy
```

## Subprojects

A subproject in Seismic Store is a working unit where a user can save datasets. The system can handle multiple subprojects under a tenant project.

Only a tenant admin can create a subproject resource by using the following sdutil command:

```code
  > python sdutil mk *sdpath *admin@email *legaltag (options)

    create a new subproject resource in Seismic Store. user can interactively
    set the storage class for the subproject. only tenant admins are allowed to create subprojects.

    *sdpath       : the seismic store subproject path. sd://<tenant>/<subproject>
    *admin@email  : the email of the user to be set as the subproject admin
    *legaltag     : the default legal tag for the created subproject

    (options)     | --idtoken=<token> pass the credential token to use, rather than generating a new one
```

## User management

To be able to use Seismic Store, users must be registered to at least a subproject resource with a role that defines their access level. Seismic store supports two roles scoped at the subproject level:

- **Admin**: Read/write access and user management.
- **Viewer**: Read/list access.

Only a subproject admin can register a user by using the following sdutil command:

```code
  > python sdutil user [ *add | *list | *remove | *roles ] (options)

    *add       $ python sdutil user add [user@email] [sdpath] [role]*
                add a user to a subproject resource

                [user@email]  : email of the user to add
                [sdpath]      : seismic store subproject path, sd://<tenant>/<subproject>
                [role]        : user role [admin|viewer]
```

## Usage examples

The following code is an example of how to use sdutil to manage datasets with Seismic Store. This example uses `sd://gtc/carbon` as the subproject resource.

```bash
  # Create a new file
  echo "My Test Data" > data1.txt

  # Upload the created file to Seismic Store
  ./sdutil cp data1.txt sd://gtc/carbon/test/mydata/data.txt

  # List the contents of the Seismic Store subproject
  ./sdutil ls sd://gtc/carbon/test/mydata/  (display: data.txt)
  ./sdutil ls sd://gtc                      (display: carbon)
  ./sdutil ls sd://gtc/carbon               (display: test/)
  ./sdutil ls sd://gtc/carbon/test          (display: data/)

  # Download the file from Seismic Store
  ./sdutil cp sd://gtc/carbon/test/mydata/data.txt data2.txt

  # Check if the original file matches the one downloaded from Seismic Store
  diff data1.txt data2.txt
```

## Tool testing

The test folder contains a set of integral/unit and regression tests written for [pytest](https://docs.pytest.org/en/latest/). Run these tests to validate the sdutil tool's functionalities.

Use this code for requirements:

```bash
  # Install required dependencies  
  pip install -r test/e2e/requirements.txt
```

Use this code for integral/unit tests:

```bash
  # Run integral/unit test
  ./devops/scripts/run_unit_tests.sh

  # Test execution parameters
  --mnt-volume = sdapi root dir (default=".")
```

Use this code for regression tests:

```bash
  # Run regression test
  ./devops/scripts/run_regression_tests.sh --cloud-provider= --service-url= --service-key= --idtoken= --tenant= --subproject=

  # Test execution parameters
  --mnt-volume = sdapi root dir (default=".")
  --disable-ssl-verify (to disable ssl verification)
```

## FAQ

### How can I generate a new command for the tool?

Run the command generation script (`./command_gen.py`) to automatically generate the base infrastructure for integrating a new command in the sdutil tool. The script creates a folder with the command infrastructure in `sdlib/cmd/new_command_name`.

```bash
  ./scripts/command_gen.py new_command_name
```

### How can I delete all files in a directory?

Use the following code:

```bash
  ./sdutil ls -lr sd://tenant/subproject/your/folder/here | xargs -r ./sdutil rm --idtoken=x.xxx.x
```

### How can I generate the tool's changelog?

Run the changelog script (`./changelog-generator.sh`) to automatically generate the tool's changelog:

```bash
  ./scripts/changelog-generator.sh
```

## Usage for Azure Data Manager for Energy

The Azure Data Manager for Energy instance uses the OSDU&reg; M12 version of sdutil. Complete the following steps if you want to use sdutil to take advantage of the Scientific Data Management System (SDMS) API of your Azure Data Manager for Energy instance:

1. Ensure that you followed the earlier [installation](#prerequisites) and [configuration](#configuration) steps. These steps include downloading the sdutil source code, configuring your Python virtual environment, editing the `config.yaml` file, and setting your three environment variables.

2. Run the following commands to do tasks in Seismic Store.

    - Initialize:

      ```code
        (sdutilenv) > python sdutil config init
        [one] Azure
        Select the cloud provider: **enter 1**
        Insert the Azure (azureGlabEnv) application key: **just press enter--no need to provide a key**

        sdutil successfully configured to use Azure (azureGlabEnv)

        Should display sign in success message. Credentials expiry set to 1 hour.
      ```

    - Sign in:

      ```bash
        python sdutil config init
        python sdutil auth login
      ```

    - List files in Seismic Store:

      ```bash
        python sdutil ls sd://<tenant> # For example, sd://<instance-name>-<datapartition>
        python sdutil ls sd://<tenant>/<subproject> # For example, sd://<instance-name>-<datapartition>/test
      ```

    - Upload a file from your local machine to Seismic Store:

      ```bash
        python sdutil cp local-dir/file-name-at-source.txt sd://<datapartition>/test/file-name-at-destination.txt
      ```

    - Download a file from Seismic Store to your local machine:

      ```bash
        python sdutil cp sd://<datapartition>/test/file-name-at-ddms.txt local-dir/file-name-at-destination.txt
      ```

      > [!NOTE]
      > Don't use the `cp` command to download VDS files. The VDS conversion results in multiple files, so the `cp` command won't be able to download all of them in one command. Use either the [SEGYExport](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/SEGYExport/README.html) or [VDSCopy](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/VDSCopy/README.html) tool instead. These tools use a series of REST calls that access a [naming scheme](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/connection.html) to retrieve information about all the resulting VDS files.

OSDU&reg; is a trademark of The Open Group.

## Next step

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Work with well data records by using Well Delivery DDMS APIs](tutorial-well-delivery-ddms.md)

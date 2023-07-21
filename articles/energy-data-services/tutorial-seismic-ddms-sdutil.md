---
title: Microsoft Azure Data Manager for Energy - Seismic store sdutil tutorial
description: Information on setting up and using sdutil, a command-line interface (CLI) tool that allows users to easily interact with seismic store.
author: elizabethhalper
ms.author: elhalper
ms.service: energy-data-services
ms.topic: tutorial
ms.date: 09/09/2022
ms.custom: template-tutorial

#Customer intent: As a developer, I want to learn how to use sdutil so that I can load data into the seismic store.
---

# Tutorial: Seismic store sdutil

Sdutil is a command line Python utility tool designed to easily interact with seismic store. The seismic store is a cloud-based solution designed to store and manage datasets of any size in the cloud by enabling a secure way to access them through a scoped authorization mechanism. Seismic Store overcomes the object size limitations imposed by a cloud provider by managing generic datasets as multi-independent objects. This provides a generic, reliable, and better performing solution to handle data in cloud storage.

**Sdutil** is an intuitive command line utility tool to interact with seismic store and perform some basic operations like upload or download datasets to or from seismic store, manage users, list folders content and more.

## Prerequisites

Install the following prerequisites based on your OS:

Windows

- [64-bit Python 3.8.3](https://www.python.org/ftp/python/3.8.3/python-3.8.3-amd64.exe)
- [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- [Linux Subsystem Ubuntu](/windows/wsl/install)

Linux

- [64-bit Python 3.8.3](https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz)

Unix/Mac

- [64-bit Python 3.8.3](https://www.python.org/ftp/python/3.8.3/Python-3.8.3.tgz)
- Apple Xcode C++ Build Tools

The utility requires other modules noted in requirements.txt. You could either install the modules as is or install them in virtualenv to keep your host clean from package conflicts. If you don't want to install them in a virtual environment, skip the four virtual environment commands below. Additionally, if you are using Mac instead of Ubuntu or WSL - Ubuntu 20.04, either use `homebrew` instead of `apt-get` as your package manager, or manually install `apt-get`.

```bash
  # check if virtualenv is already installed
  virtualenv --version

  # if not install it via pip or apt-get
  pip install virtualenv
  # or sudo apt-get install python3-venv for WSL

  # create a virtual environment for sdutil
  virtualenv sdutilenv
  # or python3 -m venv sdutilenv for WSL

  # activate the virtual environemnt
  Windows:    sdutilenv/Scripts/activate  
  Linux:      source sdutilenv/bin/activate
```

Install required dependencies:

```bash
  # run this from the extracted sdutil folder
  pip install -r requirements.txt
```

## Usage

### Configuration

1. Clone the [sdutil repository](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/home/-/tree/master) from the community Azure Stable branch and open in your favorite editor.

2. Replace the contents of `config.yaml` in the `sdlib` folder with the following yaml and fill in the three templatized values (two instances of `<meds-instance-url>` and one `<put refresh token here...>`):

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
    > Follow the directions in [How to Generate a Refresh Token](how-to-generate-refresh-token.md) to obtain a token if not already present.

3. Export or set below environment variables

    ```bash
      export AZURE_TENANT_ID=<your-tenant-id>
      export AZURE_CLIENT_ID=<your-client-id>
      export AZURE_CLIENT_SECRET=<your-client-secret>
    ```

### Running the Tool

1. Run the utility from the extracted utility folder by typing:

    ```bash
      python sdutil
    ```

    If no arguments are specified, this menu will be displayed:

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

2. If this is your first time using the tool, you must run the sdutil config init command to initialize the configuration.

    ```bash
      python sdutil config init
    ```

3. Before you start using the utility and performing any operations, you must sign in the system. When you run the following sign in command, sdutil will open a sign in page in a web browser.

    ```bash
      python sdutil auth login
    ```

    Once you've successfully logged in, your credentials will be valid for a week. You don't need to sign in again unless the credentials expired (after one week), in this case the system will require you to sign in again.

    > [!NOTE]
    > If you aren't getting the "sign in Successful!" message, make sure your three environment variables are set and you've followed all steps in the "Configuration" section above.

## Seistore Resources

Before you start using the system, it's important to understand how resources are addressed in seismic store. There are three different types of resources managed by seismic store:

- **Tenant Project:** the main project. Tenant is the first section of the seismic store path
- **Subproject:** the working subproject, directly linked under the main tenant project. Subproject is the second section of the seismic store path.
- **Dataset:** the seismic store dataset entity. Dataset is the third and last section of the seismic store path. The Dataset resource can be specified by using the form `path/dataset_name` where `path` is optional and have the same meaning of a directory in a generic file-system and `dataset_name` is the name of the dataset entity.

The seismic store uri is a string used to uniquely address a resource in the system and can be obtained by appending the prefix `sd://` before the required resource path:

```code
  sd://<tenant>/<subproject>/<path>*/<dataset>
```

For example, if we have a dataset `results.segy` stored in the directory structure `qadata/ustest` in the `carbon` subproject under the `gtc` tenant project, then the corresponding sdpath will be:

```code
  sd://gtc/carbon/qadata/ustest/results.segy
```

Every resource can be addressed by using the corresponding sdpath section

```code
  Tenant: sd://gtc
  Subproject: sd://gtc/carbon
  Dataset: sd://gtc/carbon/qadata/ustest/results.segy
```

## Subprojects

A subproject in Seismic Store is a working unit where datasets can be saved. The system can handle multiple subprojects under a tenant project.

A subproject resource can be created by a **Tenant Admin Only** with the following sdutil command:

```code
  > python sdutil mk *sdpath *admin@email *legaltag (options)

    create a new subproject resource in the seismic store. user can interactively
    set the storage class for the subproject. only tenant admins are allowed to create subprojects.

    *sdpath       : the seismic store subproject path. sd://<tenant>/<subproject>
    *admin@email  : the email of the user to be set as the subproject admin
    *legaltag     : the default legal tag for the created subproject

    (options)     | --idtoken=<token> pass the credential token to use, rather than generating a new one
```

## Users Management

To be able to use seismic store, a user must be registered to at least a subproject resource with a role that defines their access level. Seismic store supports two different roles scoped at subproject level:

- **admin**: read/write access + users management.
- **viewer**: read/list access

A user can be registered by a **Subproject Admin Only** with the following sdutil command:

```code
  > python sdutil user [ *add | *list | *remove | *roles ] (options)

    *add       $ python sdutil user add [user@email] [sdpath] [role]*
                add a user to a subproject resource

                [user@email]  : email of the user to add
                [sdpath]      : seismic store subproject path, sd://<tenant>/<subproject>
                [role]        : user role [admin|viewer]
```

## Usage Examples

The following is an example of how to use sdutil to manage datasets with the seismic store. For this example, `sd://gtc/carbon` is used as the subproject resource

```bash
  # create a new file
  echo "My Test Data" > data1.txt

  # upload the created file to seismic store
  ./sdutil cp data1.txt sd://gtc/carbon/test/mydata/data.txt

  # list the content of the seismic store subproject
  ./sdutil ls sd://gtc/carbon/test/mydata/  (display: data.txt)
  ./sdutil ls sd://gtc                      (display: carbon)
  ./sdutil ls sd://gtc/carbon               (display: test/)
  ./sdutil ls sd://gtc/carbon/test          (display: data/)

  # download the file from seismic store:
  ./sdutil cp sd://gtc/carbon/test/mydata/data.txt data2.txt

  # check if file orginal file match the one downloaded from sesimic store:
  diff data1.txt data2.txt
```

## Utility Testing

The test folder contains a set of integral/unit and regressions/e2e tests written for [pytest](https://docs.pytest.org/en/latest/). These tests should be executed to validate the utility functionalities.

Requirements

  ```bash
    # install required dependencies:  
    pip install -r test/e2e/requirements.txt
  ```

Integral/Unit tests

  ```bash
    # run integral/unit test
    ./devops/scripts/run_unit_tests.sh

    # test execution paramaters
    --mnt-volume = sdapi root dir (default=".")
  ```

Regression tests

  ```bash
    # run integral/unit test
    ./devops/scripts/run_regression_tests.sh --cloud-provider= --service-url= --service-key= --idtoken= --tenant= --subproject=

    # test execution paramaters
    --mnt-volume = sdapi root dir (default=".")
    --disable-ssl-verify (to disable ssl verification)
  ```

## FAQ

**How can I generate a new utility command?**

Run the command generation script (`./command_gen.py`) to automatically generate the base infrastructure for integrate new command in the sdutil utility. A folder with the command infrastructure will be created in sdlib/cmd/new_command_name

```bash
  ./scripts/command_gen.py new_command_name
```

**How can I delete all files in a directory?**

```bash
  ./sdutil ls -lr sd://tenant/subproject/your/folder/here | xargs -r ./sdutil rm --idtoken=x.xxx.x
```

**How can I generate the utility changelog?**

Run the changelog script (`./changelog-generator.sh`) to automatically generate the utility changelog

```bash
  ./scripts/changelog-generator.sh
```

## Usage for Azure Data Manager for Energy

Azure Data Manager for Energy instance is using OSDU&trade; M12 Version of sdutil. Follow the below steps if you would like to use SDUTIL to leverage the SDMS API of your Azure Data Manager for Energy instance.

1. Ensure you have followed the [installation](#prerequisites) and [configuration](#configuration) steps from above. This includes downloading the SDUTIL source code, configuring your Python virtual environment, editing the `config.yaml` file and setting your three environment variables. 

2. Run below commands to sign in, list, upload and download files in the seismic store.

    1. Initialize

       ```code
         (sdutilenv) > python sdutil config init
         [one] Azure
         Select the cloud provider: **enter 1**
         Insert the Azure (azureGlabEnv) application key: **just press enter--no need to provide a key**

         sdutil successfully configured to use Azure (azureGlabEnv)

         Should display sign in success message. Credentials expiry set to 1 hour.
       ```

    2. Sign in

       ```bash
         python sdutil config init
         python sdutil auth login
       ```

    3. List files in your seismic store

       ```bash
         python sdutil ls sd://<tenant> # e.g. sd://<instance-name>-<datapartition>
         python sdutil ls sd://<tenant>/<subproject> # e.g. sd://<instance-name>-<datapartition>/test
       ```

    4. Upload a file from your local machine to the seismic store

       ```bash
         python sdutil cp local-dir/file-name-at-source.txt sd://<datapartition>/test/file-name-at-destination.txt
       ```

    5. Download a file from the seismic store to your local machine

       ```bash
         python sdutil cp sd://<datapartition>/test/file-name-at-ddms.txt local-dir/file-name-at-destination.txt
       ```

       > [!NOTE]
       > Don't use `cp` command to download VDS files. The VDS conversion results in multiple files, therefore the `cp` command won't be able to download all of them in one command. Use either the [SEGYExport](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/SEGYExport/README.html) or [VDSCopy](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/VDSCopy/README.html) tool instead. These tools use a series of REST calls accessing a [naming scheme](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/connection.html) to retrieve information about all the resulting VDS files.

OSDU&trade; is a trademark of The Open Group.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Steps to interact with Well Delivery DDMS](tutorial-well-delivery-ddms.md)

---
title: Run jobs end-to-end using templates
description: With only CLI commands, you can create a pool, upload input data, create jobs and associated tasks, and download the resulting output data.
ms.topic: how-to
ms.date: 12/07/2018
ms.custom: seodec18
---
# Use Azure Batch CLI templates and file transfer

Using a Batch extension to the Azure CLI, it is possible to run Batch jobs without writing code.

Create and use JSON template files with the Azure CLI to create Batch
pools, jobs, and tasks. Use CLI extension commands to easily upload job input files to
the storage account associated with the Batch account, and download job output files.

> [!NOTE]
> JSON files don't support the same functionality as [Azure Resource Manager templates](../azure-resource-manager/templates/template-syntax.md). They are meant to be formatted like the raw REST request body. The CLI extension doesn't change any existing commands, but it does have a similar template option that adds partial Azure Resource Manager template functionality. See [Azure Batch CLI Extensions for Windows, Mac and Linux](https://github.com/Azure/azure-batch-cli-extensions).

## Overview

An extension to the Azure CLI enables Batch to be used end-to-end by users who
are not developers. With only CLI commands, you can create a pool, upload input data, create jobs and
associated tasks, and download the resulting output data. No additional code is
required. Run the CLI commands directly or integrate them into scripts.

Batch templates build on the existing Batch support in the [Azure
CLI](batch-cli-get-started.md#json-files-for-resource-creation) for JSON files to specify property values when creating pools,
jobs, tasks, and other items. Batch templates add the following capabilities:

-   Parameters can be defined. When the template is used, only the parameter
    values are specified to create the item, with other item property values
    specified in the template body. A user who understands Batch and the
    applications to be run by Batch can create templates, specifying pool, job,
    and task property values. A user less familiar with Batch and/or the
    applications only needs to specify the values for the defined
    parameters.

-   Job task factories create one or more tasks associated with a job,
    avoiding the need for many task definitions to be created and significantly
    simplifying job submission.


Jobs typically use input data files and produce output data files. A storage account is associated, by default, with each Batch account. Transfer files to and from this storage account using the
CLI, with no coding and no storage credentials.

For example, [ffmpeg](https://ffmpeg.org/) is a popular application that
processes audio and video files. Here are steps with the Azure Batch CLI to invoke
ffmpeg to transcode source video files to different resolutions.

-   Create a pool template. The user creating the template knows how to call
    the ffmpeg application and its requirements; they specify the appropriate
    OS, VM size, how ffmpeg is installed (from an application package or
    using a package manager, for example), and other pool property values. Parameters are
    created so when the template is used, only the pool ID and number of VMs
    need to be specified.

-   Create a job template. The user creating the template knows how ffmpeg
    needs to be invoked to transcode source video to a different resolution and
    specifies the task command line; they also know that there is a folder
    containing the source video files, with a task required per input file.

-   An end user with a set of video files to transcode first creates a pool
    using the pool template, specifying only the pool ID and number of VMs
    required. They can then upload the source files to transcode. A job can then
    be submitted using the job template, specifying only the pool ID and
    location of the source files uploaded. The Batch job is created, with
    one task per input file being generated. Finally, the transcoded output
    files can be downloaded.

## Installation

To install the Azure Batch CLI extension, first [Install the Azure CLI 2.0](/cli/azure/install-azure-cli), or run the Azure CLI in [Azure Cloud Shell](../cloud-shell/overview.md).

Install the latest version of the Batch extension using the
following Azure CLI command:

```azurecli
az extension add --name azure-batch-cli-extensions
```

For more information about the Batch CLI extension and additional installation options, see the [GitHub repo](https://github.com/Azure/azure-batch-cli-extensions).


To use the CLI extension features, you need an Azure Batch account and, for the commands that transfer files to and from storage, a linked storage account.

To log into a Batch account with the Azure CLI, see [Manage Batch resources with Azure CLI](batch-cli-get-started.md).

## Templates

Azure Batch templates are similar to Azure Resource Manager templates, in functionality and
syntax. They are JSON files that contain item property names and values, but add
the following main concepts:

-   **Parameters**

    -   Allow property values to be specified in a body section, with only
        parameter values needing to be supplied when the template is used. For
        example, the complete definition for a pool could be placed in the body
        and only one parameter defined for `poolId`; only a pool ID string
        therefore needs to be supplied to create a pool.
        
    -   The template body can be authored by someone with knowledge of Batch and
        the applications to be run by Batch; only values for the author-defined
        parameters must be supplied when the template is used. A user without
        the in-depth Batch and/or application knowledge can therefore use the
        templates.

-   **Variables**

    -   Allow simple or complex parameter values to be specified in one place
        and used in one or more places in the template body. Variables can
        simplify and reduce the size of the template, as well as make it more
        maintainable by having one location to change properties.

-   **Higher-level constructs**

    -   Some higher-level constructs are available in the template
        that are not yet
        available in the Batch APIs. For example, a task factory can be defined
        in a job template that creates multiple tasks for the job, using a
        common task definition. These constructs avoid the need to code to
        dynamically create multiple JSON files, such as one file per task, as
        well as create script files to install applications via a package
        manager.

    -   At some point, these constructs may be added to the
        Batch service and available in the Batch APIs, UIs, etc.

### Pool templates

Pool templates support the standard template capabilities of parameters and variables. They also support the following higher-level construct:

-   **Package references**

    -   Optionally allows software to be copied to pool nodes by using package
        managers. The package manager and package ID are specified. By declaring one or more packages, you avoid creating a script that
        gets the required packages, installing the script, and running the script on
        each pool node.

The following is an example of a template that creates a pool of Linux VMs with
ffmpeg installed. To use it, supply only a pool ID string and the number of VMs in the pool:

```json
{
    "parameters": {
        "nodeCount": {
            "type": "int",
            "metadata": {
                "description": "The number of pool nodes"
            }
        },
        "poolId": {
            "type": "string",
            "metadata": {
                "description": "The pool ID "
            }
        }
    },
    "pool": {
        "type": "Microsoft.Batch/batchAccounts/pools",
        "apiVersion": "2016-12-01",
        "properties": {
            "id": "[parameters('poolId')]",
            "virtualMachineConfiguration": {
                "imageReference": {
                    "publisher": "Canonical",
                    "offer": "UbuntuServer",
                    "sku": "16.04-LTS",
                    "version": "latest"
                },
                "nodeAgentSKUId": "batch.node.ubuntu 16.04"
            },
            "vmSize": "STANDARD_D3_V2",
            "targetDedicatedNodes": "[parameters('nodeCount')]",
            "enableAutoScale": false,
            "maxTasksPerNode": 1,
            "packageReferences": [
                {
                    "type": "aptPackage",
                    "id": "ffmpeg"
                }
            ]
        }
    }
}
```

If the template file was named _pool-ffmpeg.json_, then invoke the template as follows:

```azurecli
az batch pool create --template pool-ffmpeg.json
```

The CLI prompts you to provide values for the `poolId` and `nodeCount` parameters. You can also supply the parameters in a JSON file. For example:

```json
{
  "poolId": {
    "value": "mypool"
  },
  "nodeCount": {
    "value": 2
  }
}
```

If the parameters JSON file was named *pool-parameters.json*, then invoke the template as follows:

```azurecli
az batch pool create --template pool-ffmpeg.json --parameters pool-parameters.json
```

### Job templates

Job templates support the standard template capabilities of parameters and variables. They also support the following higher-level construct:

-   **Task factory**

    -   Creates multiple tasks for a job from one task definition. Three
        types of task factory are supported – parametric sweep, task per file,
        and task collection.

The following is an example of a template that creates a job to
transcode MP4 video files with ffmpeg to one of two lower resolutions. It creates one task
per source video file. See [File groups and file transfer](#file-groups-and-file-transfer) for more about file groups for job input and output.

```json
{
    "parameters": {
        "poolId": {
            "type": "string",
            "metadata": {
                "description": "The name of Azure Batch pool which runs the job"
            }
        },
        "jobId": {
            "type": "string",
            "metadata": {
                "description": "The name of Azure Batch job"
            }
        },
        "resolution": {
            "type": "string",
            "defaultValue": "428x240",
            "allowedValues": [
                "428x240",
                "854x480"
            ],
            "metadata": {
                "description": "Target video resolution"
            }
        }
    },
    "job": {
        "type": "Microsoft.Batch/batchAccounts/jobs",
        "apiVersion": "2016-12-01",
        "properties": {
            "id": "[parameters('jobId')]",
            "constraints": {
                "maxWallClockTime": "PT5H",
                "maxTaskRetryCount": 1
            },
            "poolInfo": {
                "poolId": "[parameters('poolId')]"
            },
            "taskFactory": {
                "type": "taskPerFile",
                "source": { 
                    "fileGroup": "ffmpeg-input"
                },
                "repeatTask": {
                    "commandLine": "ffmpeg -i {fileName} -y -s [parameters('resolution')] -strict -2 {fileNameWithoutExtension}_[parameters('resolution')].mp4",
                    "resourceFiles": [
                        {
                            "blobSource": "{url}",
                            "filePath": "{fileName}"
                        }
                    ],
                    "outputFiles": [
                        {
                            "filePattern": "{fileNameWithoutExtension}_[parameters('resolution')].mp4",
                            "destination": {
                                "autoStorage": {
                                    "path": "{fileNameWithoutExtension}_[parameters('resolution')].mp4",
                                    "fileGroup": "ffmpeg-output"
                                }
                            },
                            "uploadOptions": {
                                "uploadCondition": "TaskSuccess"
                            }
                        }
                    ]
                }
            },
            "onAllTasksComplete": "terminatejob"
        }
    }
}
```

If the template file was named _job-ffmpeg.json_, then invoke the template as follows:

```azurecli
az batch job create --template job-ffmpeg.json
```

As before, the CLI prompts you to provide values for the parameters. You can also supply the parameters in a JSON file.

### Use templates in Batch Explorer

You can upload a Batch CLI template to the [Batch Explorer](https://github.com/Azure/BatchExplorer) desktop application (formerly called BatchLabs) to create a Batch pool or job. You can also select from predefined pool and job templates in the Batch Explorer Gallery.

To upload a template:

1. In Batch Explorer, select **Gallery** > **Local templates**.

2. Select, or drag and drop, a local pool or job template.

3. Select **Use this template**, and follow the on-screen prompts.

## File groups and file transfer

Most jobs and tasks require input files and produce output files. Usually, input files and output files are transferred, either from the client to the node, or from the node to the client. The Azure Batch CLI extension abstracts away file transfer and utilizes the storage account that you can associate with each Batch account.

A file group equates to a container that is created in the Azure storage account. The file group may have subfolders.

The Batch CLI extension provides commands to upload files from client to a specified file group and download files from the specified file group to a client.

```azurecli
az batch file upload --local-path c:\source_videos\*.mp4 
    --file-group ffmpeg-input

az batch file download --file-group ffmpeg-output --local-path
    c:\output_lowres_videos
```

Pool and job templates allow files stored in file groups to be specified for
copy onto pool nodes or off pool nodes back to a file group. For example, in the
job template specified previously, the file group *ffmpeg-input* is specified
for the task factory as the location of the source video files copied down to
the node for transcoding. The file group *ffmpeg-output* is the location
where the transcoded output files are copied from the node running each task.

## Summary

Template and file transfer support have currently been added only to the Azure CLI. The goal is to expand the audience that can use Batch to users
who do not need to develop code using the Batch APIs, such as researchers and IT users. Without coding, users with knowledge of Azure, Batch, and the applications to be run by Batch can create templates for pool and job creation. With template parameters, users without detailed knowledge of Batch and the applications can use the templates.

Try out the Batch extension for the Azure CLI and provide us with any feedback or suggestions, either in the comments for this article or via the [Batch Community repo](https://github.com/Azure/Batch).

## Next steps

- Detailed installation and usage documentation, samples, and source code are
available in the [Azure GitHub
repo](https://github.com/Azure/azure-batch-cli-extensions).

- Learn more about using [Batch Explorer](https://github.com/Azure/BatchExplorer) to create and manage Batch resources.




# Using Azure Batch CLI Templates and File Transfer (Preview)

Using the Azure CLI it is possible to run Batch jobs end-to-end with no code.

Template files can be created and used with the Azure CLI that allow Batch
pools, jobs and tasks to be created. Job input files can be easily uploaded to
the storage account associated with the Batch account and job output files
downloaded.

## Overview

An extension to the Azure CLI enables Batch to be used end-to-end by users who
are not developers. A pool can be created, input data uploaded, jobs and
associated tasks created, and the resulting output data downloaded – no code
required, the CLI being used directly or being integrated into scripts.

Batch templates build on the [existing Batch support in the Azure
CLI](https://docs.microsoft.com/azure/batch/batch-cli-get-started#json-files-for-resource-creation)
that allows JSON files to specify property values for the creation of pools,
jobs, tasks, and other items. With Batch templates, the following capabilities
are added over what is possible with the JSON files:

-   Parameters can be defined. When the template is used, only the parameter
    values are specified to create the item, with other item property values
    being specified in the template body. A user who understands Batch and the
    applications to be run by Batch can create templates, specifying pool, job,
    and task property values. A user less familiar with Batch and/or the
    applications simply only needs to specify the values for the defined
    parameters.

-   Job task factories create the one or more tasks associated with a job,
    avoiding the need for many task definitions to be created and drastically
    simplifying job submission.

Input data files need to be supplied for jobs and output data files are often
produced. A storage account is associated, by default, with each Batch account
and files can be easily transferred to and from this storage account using the
CLI, with no coding and no storage credentials required.

For example, [ffmpeg](http://ffmpeg.org/) is a popular application that
processes audio and video files. The Azure Batch CLI can be used to invoke
ffmpeg to transcode source video files to different resolutions.

-   A pool template is created. The user creating the template knows how to call
    the ffmpeg application and its requirements; they specify the appropriate
    OS, VM size, how ffmpeg is installed (e.g. from application packages or
    using a package manager), and other pool property values. Parameters are
    created so when the template is used, only the pool id and number of VMs
    need to be specified.

-   A job template is created. The user creating the template knows how ffmpeg
    needs to be invoked to transcode source video to a different resolution and
    specifies the task command line; they also know that there will be a folder
    containing the source video files, with a task required per input file.

-   An end-user with a set of video files to transcode will first create a pool
    using the pool template, specifying only the pool id and number of VMs
    required. They can then upload the source files to transcode. A job can then
    be submitted using the job template, specifying only the pool id and
    location of the source files uploaded. The Batch job will be created, with
    one task per input file being generated. Finally, the transcoded output
    files can be download.

## Installation

The template and file transfer capabilities require an extension to be
installed.

For instructions on how to install the Azure CLI see [this
page](https://docs.microsoft.com/cli/azure/install-azure-cli).

Once the Azure CLI has been installed, the extension can be installed using the
following CLI command:

```azurecli
az component update --add batch-extensions --allow-third-party
```

## Templates

The Azure Batch CLI allows items such as pools, jobs, and tasks to be created by
specifying a JSON file containing property names and values. E.g.

```azurecli
az batch pool create –json-file AppPool.json
```

Azure Batch templates are very similar to ARM templates, in functionality and
syntax. They are JSON files that contain item property names and values, but add
the following main concepts:

-   **Parameters**

    -   Allow property values to be specified in a body section, with only
        parameter values needing to be supplied when the template is used. For
        example, the complete definition for a pool could be placed in the body
        and only one parameter defined for pool id; only a pool id string
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
        maintainable by having one location to change properties who value may
        change.

-   **Higher-level Constructs**

    -   Some higher-level constructs are available the template that are not yet
        available in the Batch APIs. For example, a task factory can be defined
        in a job template that will create multiple tasks for the job using a
        common task definition. These constructs avoid the need to code to
        dynamically create multiple JSON files, such as one file per task, as
        well as create script files to install applications via a package
        manager, for example.

    -   At some point, where applicable, these constructs may be added to the
        Batch service and available in the Batch APIs, UIs, etc.

## Pool Templates

In addition to the standard template capabilities of parameters and variables,
the following higher-level constructs are supported by the pool template:

-   **Package references**

    -   Optionally allows software to be copied to pool nodes by using package
        managers. The package manager and package id are specified. Being able
        to declare one or more packages avoids the need to create a script that
        gets the required packages, install the script, and run the script on
        each pool node.

The following is an example of a template that creates a pool of Linux VMs with
ffmpeg installed and only requires a pool id string and the number of VMs to be
supplied to use:

```azurecli
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
                "description": "The pool id "
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
                    "sku": "16.04.0-LTS",
                    "version": "latest"
                },
                "nodeAgentSKUId": "batch.node.ubuntu 16.04"
            },
            "vmSize": "STANDARD_D3_V2",
            "targetDedicated": "[parameters('nodeCount')]",
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

If the template file was named _pool-ffmpeg.json_, then the template would be
invoked as follows:

```azurecli
az batch pool create --template pool-ffmpeg.json
```

## Job Templates

In addition to the standard template capabilities of parameters and variables,
the following higher-level constructs are supported by the job template:

-   **Task factory**

    -   Will create multiple tasks for a job from one task definition. Three
        types of task factory are supported – parametric sweep, task per file,
        and task collection.

The following is an example of a template that creates a job that uses ffmpeg to
transcode MP4 video files to one of two lower resolutions, with one task created
per source video file:

```azurecli
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
                            "uploadDetails": {
                                "taskStatus": "TaskSuccess"
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

If the template file was named job-ffmpeg.json, then the template would be
invoked as follows:

```azurecli
az batch job create --template job-ffmpeg.json
```

## File Groups and File Transfer

In addition to the creation of pools, jobs, and tasks, the majority of jobs will
require input files and produce output files; the input files may need to be
uploaded from a client and then copied onto a pool node or nodes; output files
produced by tasks on a pool node need to be persisted and then downloaded to a
client.

The Azure Batch CLI extension abstracts away file transfer and utilizes the
storage account that is created by default for each Batch account.

The concept of a file group has been introduced, which equates to a container
that is created in the Azure storage account. The file group can have
sub-folders.

CLI commands are provided that allow files to be uploaded from client to a
specified file group and will download files from the specified file group to a
client.

```azurecli
az batch file upload --local-path c:\source_videos\*.mp4 
    --file-group ffmpeg-input

az batch file download --file-group ffmpeg-output --local-path
    c:\output_lowres_videos
```

Pool and job templates allow files stored in file groups to be specified for
copy onto pool nodes or off pool nodes back to a file group. For example, in the
job template specified previously, the file group “ffmpeg-input” is specified
for the task factory as the location of the source video files copied down onto
the node for transcoding; the file group “ffmpeg-output” is used as the location
where the transcoded output files are copied to from the node running each task.

## Future Direction

Templates and file transfer support have currently been added to only the Azure
CLI. The goal is to expand the audience that can use Batch end-to-end to users
who do not need to develop code using the Batch APIs, such as researchers, IT
users, and so on.

Without coding, users with knowledge of Azure, Batch, and the applications to be
run by Batch, can create templates for pool and job creation; template
parameters mean that users without detailed knowledge of Batch and the
applications can use the templates.

Further capabilities may be added in the future, as well as exposing concepts
natively in the Batch service and making them available in the APIs, PowerShell,
portal UI, etc. For example:

-   UI could be provided to define templates, avoiding the need to author,
    modify, store, and share JSON files.

-   Templates could be assigned an id, persisted by the Batch service, and
    associated with the Batch account. UI, CLI, and API support would allow
    templates to be created, updated, and deleted. Templates and parameters
    values could be specified when creating pools or jobs, instead of specifying
    all property values required for creation; pool and job creation UI would
    dynamically generate UI to prompt for parameter values.

Please try out the Azure CLI and let us know your feedback and feature
suggestions, either by using the comments for this article or the [Azure Batch
MSDN
forum](https://social.msdn.microsoft.com/forums/azure/home?forum=azurebatch).

## Next Steps

Detailed installation and usage documentation, samples, and source code are
available in the [Azure GitHub
repository](https://github.com/Azure/azure-batch-cli-extensions).

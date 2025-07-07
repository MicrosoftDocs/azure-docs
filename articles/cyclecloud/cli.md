---
title: Azure CycleCloud CLI Reference
description: CycleCloud CLI reference 
author: rokeptne
ms.date: 06/10/2025
ms.author: padmalathas
---

# CycleCloud CLI

The Azure CycleCloud CLI allows you to manage your installation from a console or script file.

## Global CLI Parameters

These parameters are available for all commands.

### `-h, --help`

Shows the help message and exits.

### `-v, --version`

Shows the version for the CLI.

### `--config=CONFIG_FILE`

Specifies the path to a nondefault config file to be used for this command.

### `--loglevel=LOG_LEVEL`

Sets the default log level for the CLI.

## cyclecloud account

Manage cloud provider accounts.

```CycleCloud CLI
cyclecloud account <command> [-o OUTPUT_FILE]
                             [--dry-run]
                             [-f INPUT_FILE]
                             [--force]
```

| subcommand | description |
| ----- | ----- |
| `list` | List accounts. |
| `show <account_name>` | Show detail for an account. |
| `create` | Create a new account. |
| `edit <account_name>` | Edit an existing account. |
| `delete <account_name>` | Delete an existing account. |

## cyclecloud account list

List accounts.

```CycleCloud CLI
cyclecloud account list
```

## cyclecloud account show

Show detail for an account.

```CycleCloud CLI
cyclecloud account show <account_name>
```

## cyclecloud account create

Create a new account.

```CycleCloud CLI
cyclecloud account create [-o OUTPUT_FILE]
                          [--dry-run]
                          [-f INPUT_FILE]
```

### `-o OUTPUT_FILE`

Writes the configuration parameters to disk

### `--dry-run`

Prompts and validates information but doesn't enact any changes

### `-f INPUT_FILE`

Reads the definition from a configuration file instead of prompting

## cyclecloud account edit

Edit an existing account.

```CycleCloud CLI
cyclecloud account edit <account_name> [-o OUTPUT_FILE]
                                       [--dry-run]
                                       [-f INPUT_FILE]
```

### `-o OUTPUT_FILE`

Writes the configuration parameters to disk.

### `--dry-run`

Prompts and validates information but doesn't enact any changes.

### `-f INPUT_FILE`

Reads the definition from a configuration file instead of prompting.

## cyclecloud account delete

Delete an existing account.

```CycleCloud CLI
cyclecloud account delete <account_name> [--force]
```

### `--force`

If true, doesn't prompt to delete the account.

## cyclecloud add_node

Adds more nodes to the cluster.

```CycleCloud CLI
cyclecloud add_node <CLUSTER> [--template=TEMPLATE]
                              [--count=COUNT]
                              [--fixed]
```

### `-t TEMPLATE, --template=TEMPLATE`

The template to use for this node. If not specified, the default is to use the only template available otherwise error.

### `-c COUNT, --count=COUNT`

How many nodes to start. If not specified, the default is 1.

### `-f, --fixed`

If set, the node is permanently added (until removed) to the cluster template. Otherwise, the node is automatically removed when terminated.

## cyclecloud config

Easily switch between cyclecloud configurations.

```CycleCloud CLI
cyclecloud config <command>
```

| Subcommand | Description |
| ----- | ----- |
| `show` | Show the current configuration. |
| `list` | List available configurations. |
| `create <config_name>` | Create a new configuration. |
| `rename <old_name> <new_name>` | Rename an existing configuration. |
| `use <config_name>` | Switch to a specified configuration. |
| `remove <config_name>` | Remove a named configuration. |

## cyclecloud config show

Show the current configuration.

```CycleCloud CLI
cyclecloud config show
```

## cyclecloud config list

List available configurations.

```CycleCloud CLI
cyclecloud config list
```

## cyclecloud config create

Create a new configuration.

```CycleCloud CLI
cyclecloud config create <config_name>
```

## cyclecloud config rename

Rename an existing configuration.

```CycleCloud CLI
cyclecloud config rename <old_name> <new_name>
```

## cyclecloud config use

Switch to a specified configuration.

```CycleCloud CLI
cyclecloud config use <config_name>
```

## cyclecloud config remove

Remove a named configuration.

```CycleCloud CLI
cyclecloud config remove <config_name>
```

## cyclecloud connect

Connects to a running instance in the cluster. As of 7.8, the Name can be either a node name, a hostname, or an IP address.

```CycleCloud CLI
cyclecloud connect <NAME> [--keyfile=KEYFILE]
                          [--cluster=CLUSTER]
                          [--user=USER]
                          [--bastion-host=BASTION-HOST]
                          [--bastion-port=BASTION-PORT]
                          [--bastion-user=BASTION-USER]
                          [--bastion-key=BASTION-KEY]
```

### `-k KEYFILE, --keyfile=KEYFILE`

The keypair to use, if not given on the node or the node doesn't exist.

### `-c CLUSTER, --cluster=CLUSTER`

The cluster the node is in, if the name is a node name. Optional unless there are multiple nodes with the same name.

### `-u USER, --user=USER`

The user to sign in to the node.

### `--bastion-host=BASTION-HOST`

SSH bastion host to route connections through.

### `--bastion-port=BASTION-PORT`

SSH port for connecting to the bastion.

### `--bastion-user=BASTION-USER`

User name for connecting to the bastion.

### `--bastion-key=BASTION-KEY`

Private key file for connecting to the bastion.

## cyclecloud copy_cluster

Makes a copy of a cluster.

```CycleCloud CLI
cyclecloud copy_cluster <source_cluster_name> <new_cluster_name> [--parameters=PARAMETERS]
```

### `-p PARAMETERS, --parameters=PARAMETERS`

The parameters file to use.

## cyclecloud create_cluster

Creates a cluster from an existing template.

```CycleCloud CLI
cyclecloud create_cluster <TEMPLATE> <NAME> [--force]
                                            [--parameters=PARAMETERS]
                                            [--parameter-override=PARAMETER_OVERRIDE]
```

### `--force`

If specified, the cluster is replaced if it exists.

### `-p PARAMETERS, --parameters=PARAMETERS`

The parameters file to use.

### `-P PARAMETER_OVERRIDE, --parameter-override=PARAMETER_OVERRIDE`

Add or override a specific parameter. This option takes precedence over values specified in `-p`.

## cyclecloud credential

Manage cloud provider account credentials.

```CycleCloud CLI
cyclecloud credential <command>
```

| Subcommand | Description |
| ----- | ----- |
| `list` | List credentials. |
| `create` | Create a new credential. |
| `edit <account_name>` | Edit an existing credential. |
| `delete <account_name>` | Delete an existing credential. |

## cyclecloud credential list

List credentials.

```CycleCloud CLI
cyclecloud credential list
```

## cyclecloud credential create

Create a new credential.

```CycleCloud CLI
cyclecloud credential create
```

## cyclecloud credential edit

Edit an existing credential.

```CycleCloud CLI
cyclecloud credential edit <account_name>
```

## cyclecloud credential delete

Delete an existing credential.

```CycleCloud CLI
cyclecloud credential delete <account_name>
```

## cyclecloud delete_cluster

Delete a nonrunning cluster.

```CycleCloud CLI
cyclecloud delete_cluster <CLUSTER> [--recursive]
                                    [--force]
```

### `-r, --recursive`

Recursively delete this cluster and all its subclusters.

### `--force`

Force this cluster to be deleted. Use this option only if all resources in your cloud provider are already terminated.

## cyclecloud delete_template

Delete a cluster template.

```CycleCloud CLI
cyclecloud delete_template <TEMPLATE>
```

## cyclecloud export_parameters

Export Parameters for a given cluster.

```CycleCloud CLI
cyclecloud export_parameters <cluster_name> [-o OUTPUT_FILE]
                                            [--format=OUTPUT_FORMAT]
```

### `-o OUTPUT_FILE`

For create, writes the cluster parameters to disk.

### `--format=OUTPUT_FORMAT`

Output format.

## cyclecloud image

Manage custom images.

```CycleCloud CLI
cyclecloud image <command> [--account=ACCOUNTS]
                           [--name=NAME]
                           [--label=LABEL]
                           [--package-version=PACKAGE_VERSION]
                           [--bump-version=BUMP_VERSION]
                           [--os=OS]
                           [--jetpack-version=JETPACK_VERSION]
                           [--install-jetpack]
                           [--jetpack-platform=JETPACK_PLATFORM]
                           [--dry-run]
```

| Subcommand | Description |
| ----- | ----- |
| `add <image_name> [...]` | Add one or more images. |

## cyclecloud image add

Add one or more images.

```CycleCloud CLI
cyclecloud image add <image_name> [...] [--account=ACCOUNTS]
                                        [--name=NAME]
                                        [--label=LABEL]
                                        [--package-version=PACKAGE_VERSION]
                                        [--bump-version=BUMP_VERSION]
                                        [--os=OS]
                                        [--jetpack-version=JETPACK_VERSION]
                                        [--install-jetpack]
                                        [--jetpack-platform=JETPACK_PLATFORM]
                                        [--dry-run]
```

### `--account=ACCOUNTS`

Search only this account. You can repeat this option for multiple accounts.

### `--name=NAME`

The name of the package to create. This parameter is required.

### `--label=LABEL`

The label of the package to create.

### `--package-version=PACKAGE_VERSION`

Use this version for the new image instead of the default of 1.0.0.

### `--bump-version=BUMP_VERSION`

Use `--bump-version minor` to increment the latest minor version by 1 (for example, 1.1 to 1.2), or use `--bump-version major` or `--bump-version patch`.

### `--os=OS`

Use `--os linux/windows` to specify the operating system on the image.

### `--jetpack-version=JETPACK_VERSION`

The version of Jetpack that is installed or should be installed on the image.

### `--install-jetpack`

Install Jetpack at runtime on this image.

### `--jetpack-platform=JETPACK_PLATFORM`

The Jetpack platform used on the image (for example, centos-7, ubuntu-14.04, windows).

### `--dry-run`

Looks for matching images but doesn't store any image information.

## cyclecloud import_cluster

Creates a cluster from a text file. If CLUSTER isn't provided and the file contains a single cluster, the name of that cluster is used.

```CycleCloud CLI
cyclecloud import_cluster [CLUSTER] [-c TEMPLATE]
                                    [--force]
                                    [--as-template]
                                    [--file=FILE]
                                    [--parameters=PARAMETERS]
                                    [--parameter-override=PARAMETER_OVERRIDE]
                                    [--recursive]
```

### `-c TEMPLATE`

The cluster in the file to import. If not specified, the name of the new cluster is used.

### `--force`

If specified, the cluster is replaced if it exists.

### `-t, --as-template`

If specified, the cluster is stored as a template which can only be used to create other clusters.

### `-f FILE, --file=FILE`

The file for importing the template.

### `-p PARAMETERS, --parameters=PARAMETERS`

The parameters file to use.

### `-P PARAMETER_OVERRIDE, --parameter-override=PARAMETER_OVERRIDE`

Add or override a specific parameter. Takes precedent over values specified in `-p`.

### `-r, --recursive`

Imports the named cluster and all clusters in the file for which it's the parent.

## cyclecloud import_template

Imports a cluster template from a text file. If NAME isn't given, and the file has a single cluster, the name of that cluster is used.

```CycleCloud CLI
cyclecloud import_template [NAME] [-c TEMPLATE]
                                  [--force]
                                  [--file=FILE]
```

### `-c TEMPLATE`

The template in the file to import. If not specified, the name of the new template is used.

### `--force`

If specified, the template is replaced if it exists.

### `-f FILE, --file=FILE`

The file for importing the template.

## cyclecloud initialize

Initializes CycleCloud settings.

```CycleCloud CLI
cyclecloud initialize [--batch]
                      [--force]
                      [--url=URL]
                      [--username=USERNAME]
                      [--password=PASSWORD]
                      [--verify-ssl=VERIFY-SSL]
                      [--name=NAMED_CONFIG]
```

### `--batch`

If specified, the arguments must be supplied on the command line. Questions are assumed to be 'no'.

### `--force`

Force reinitialization even if a valid config file is available.

### `--url=URL`

The base URL for the CycleServer install.

### `--username=USERNAME`

The username for the CycleServer install.

### `--password=PASSWORD`

The password for the CycleServer install.

### `--verify-ssl=VERIFY-SSL`

Whether to verify (true) or not (false) SSL certificates for the CycleServer install.

### `--name=NAMED_CONFIG`

Create a named configuration that you can use with the config command.

## cyclecloud locker

Manage CycleCloud lockers.

```CycleCloud CLI
cyclecloud locker <command>
```

| Subcommand | Description |
| ----- | ----- |
| `list` | List lockers. |
| `show <locker>` | Show detail for a locker. |

## cyclecloud locker list

List lockers.

```CycleCloud CLI
cyclecloud locker list
```

## cyclecloud locker show

Show detail for a locker.

```CycleCloud CLI
cyclecloud locker show <locker>
```

## cyclecloud project

Manage CycleCloud projects.

```CycleCloud CLI
cyclecloud project <command> [--skip-teardown]
                             [--output-json=JSON_FILE]
                             [--junit-xml=JUNIT_FILE]
                             [--extra-var=EXTRA_VARS]
                             [--template=TEMPLATE]
                             [--name=CLUSTER_NAME]
                             [--global]
                             [--project-version=PROJECT_VERSION]
                             [--build-dir=BUILD_DIR]
```

| Subcommand | Description |
| ----- | ----- |
| `init <name>` | Create a new empty project. |
| `fetch <url> <path>` | Fetch a project from a GitHub \<url\> to \<path\>. |
| `info` | Display project info. |
| `add_spec <spec>` | Add a spec to the project. |
| `default_locker <locker>` | Set the default lockers to upload to. |
| `test` | Execute integration test for a given cluster definition. |
| `build` | Build the project. |
| `upload [locker]` | Build and upload project the specified lockers (uses default if none specified). |
| `download [locker]` | Download the project blobs from the specified lockers (uses default if none specified). |
| `generate_template <file>` | Generate a cluster template for the project, written to \<file\>. |

## cyclecloud project init

Create a new empty project.

```CycleCloud CLI
cyclecloud project init <name>
```

## cyclecloud project fetch

Fetches a project from a GitHub `<url>` to `<path>`.

```CycleCloud CLI
cyclecloud project fetch <url> <path>
```

## cyclecloud project info

Displays the project info.

```CycleCloud CLI
cyclecloud project info
```

## cyclecloud project add_spec

Adds a spec to the project.

```CycleCloud CLI
cyclecloud project add_spec <spec>
```

## cyclecloud project default_locker

Sets the default locker for uploads.

```CycleCloud CLI
cyclecloud project default_locker <locker> [--global]
```

### `--global`

Set global default instead of project specific value.

## cyclecloud project test

Executes integration test for a cluster definition.

```CycleCloud CLI
cyclecloud project test [--skip-teardown]
                        [--output-json=JSON_FILE]
                        [--junit-xml=JUNIT_FILE]
                        [--extra-var=EXTRA_VARS]
                        [--template=TEMPLATE]
                        [--name=CLUSTER_NAME]
```

### `--skip-teardown`

Skip tearing down cluster created for testing.

### `--output-json=JSON_FILE`

Output the results to the specified json file.

### `--junit-xml=JUNIT_FILE`

Output the results in junit-xml format to the specified json file.

### `-e EXTRA_VARS, --extra-var=EXTRA_VARS`

Arbitrary key=value pairs used to parameterize the cluster template under test.

### `-t TEMPLATE, --template=TEMPLATE`

Path to cluster template file.

### `-n CLUSTER_NAME, --name=CLUSTER_NAME`

Name of cluster definition to test.

## cyclecloud project build

Build the project.

```CycleCloud CLI
cyclecloud project build [--project-version=PROJECT_VERSION]
                         [--build-dir=BUILD_DIR]
```

### `--project-version=PROJECT_VERSION`

Override the project version present in project.ini.

### `--build-dir=BUILD_DIR`

The build directory.

## cyclecloud project upload

Build and upload project the specified lockers (uses default if none specified).

```CycleCloud CLI
cyclecloud project upload [locker] [--project-version=PROJECT_VERSION]
```

### `--project-version=PROJECT_VERSION`

Override the project version present in project.ini.

## cyclecloud project download

Download the project blobs from the specified lockers. If you don't specify lockers, the command uses the default lockers.

```CycleCloud CLI
cyclecloud project download [locker]
```

## cyclecloud project generate_template

Generate a cluster template for the project. The command writes the template to `<file>`.

```CycleCloud CLI
cyclecloud project generate_template <file>
```

## cyclecloud reboot_node

Reboot a running node.

```CycleCloud CLI
cyclecloud reboot_node <CLUSTER> <NODE_NAME>
```

## cyclecloud remove_node

Remove a node from the cluster. The command terminates the node if it started.

```CycleCloud CLI
cyclecloud remove_node <CLUSTER> <NODE_NAME> [--filter=FILTER]
                                             [--instance-filter=INSTANCE_FILTER]
                                             [--creds=CREDS]
                                             [--no-prompt]
                                             [--force]
```

### `-f FILTER, --filter=FILTER`

Remove nodes that match the complete class-ad expression.

### `--instance-filter=INSTANCE_FILTER`

Remove nodes with active instances that match the complete class-ad expression.

### `--creds=CREDS`

Remove nodes that you started using the named set of credentials.

### `--no-prompt`

If specified, doesn't ask for confirmation before terminating nodes based on a filter.

### `--force`

Force this node to be removed, even if not terminated. Only use this option if the resources for this node in your cloud provider are already terminated.

## cyclecloud retry

Retries failed initialization operations for the named cluster.

```CycleCloud CLI
cyclecloud retry <CLUSTER> [--recursive]
```

### `-r, --recursive`

Recursively retry options in this cluster and all its subclusters.

## cyclecloud show_cluster

Shows the cluster or clusters in CycleCloud.

```CycleCloud CLI
cyclecloud show_cluster <CLUSTER> [--recursive]
                                  [--long]
                                  [--templates]
```

### `-r, --recursive`

Show this cluster and all of its subclusters.

### `-l, --long`

Lists each node rather than showing a summary.

### `-t, --templates`

Include cluster templates in the output.

## cyclecloud show_nodes

Show details of selected nodes or instances.

```CycleCloud CLI
cyclecloud show_nodes [NAME] [--attrs=ATTRS]
                             [--filter=FILTER]
                             [--instance-filter=INSTANCE_FILTER]
                             [--output=OUTPUT]
                             [--format=FORMAT]
                             [--creds=CREDS]
                             [--cluster=CLUSTER]
                             [--states=STATES]
                             [--long]
                             [--summary]
```

### `-a ATTRS, --attrs=ATTRS`

Display the specified set of attributes (comma-separated list).

### `-f FILTER, --filter=FILTER`

Show only nodes matching the complete class-ad expression.

### `--instance-filter=INSTANCE_FILTER`

Show only nodes with active instances matching the complete class-ad expression.

### `--output=OUTPUT`

Output the matching node attributes described by a Python-style named-parameter format string. For example, `--output="Name: %(Name)s\t(ID: %(InstanceId)s)\n Cluster: %(ClusterName)s\n"`.

### `--format=FORMAT`

Change the output display format [xml | json | text].

### `--creds=CREDS`

Show only nodes started using the named set of credentials.

### `-c CLUSTER, --cluster=CLUSTER`

Show only nodes in the specified cluster.

### `--states=STATES`

Show only nodes in the specified states (comma-separated list).

### `-l, --long`

Display the complete class-ad representation of the node.

### `-s, --summary`

Display a minimal representation of the node.

## cyclecloud start_cluster

Starts the named cluster.

```CycleCloud CLI
cyclecloud start_cluster <CLUSTER> [--recursive]
                                   [--test]
```

### `-r, --recursive`

Recursively start this cluster and all its subclusters.

### `-t, --test`

Start cluster in test mode.

## cyclecloud start_node

Starts terminated nodes in a running cluster.

```CycleCloud CLI
cyclecloud start_node <CLUSTER> <NODE_NAME>
```

## cyclecloud terminate_cluster

Terminates the named cluster.

```CycleCloud CLI
cyclecloud terminate_cluster <CLUSTER> [--recursive]
```

### `-r, --recursive`

Recursively terminate this cluster and all its subclusters.

## cyclecloud terminate_node

Terminates a running node (but leaves it in the cluster).

```CycleCloud CLI
cyclecloud terminate_node <CLUSTER> <NODE_NAME> [--filter=FILTER]
                                                [--instance-filter=INSTANCE_FILTER]
                                                [--creds=CREDS]
                                                [--no-prompt]
```

### `-f FILTER, --filter=FILTER`

Terminate nodes matching the complete class-ad expression.

### `--instance-filter=INSTANCE_FILTER`

Terminate nodes with active instances matching the complete class-ad expression.

### `--creds=CREDS`

Terminate nodes started using the named set of credentials.

### `--no-prompt`

If specified, doesn't ask for confirmation before terminating nodes based on a filter.


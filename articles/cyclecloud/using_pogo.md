# Using pogo

The Pogo call structure is as follows:

    pogo [options] <command> <source_url> [destination_url]

## Supported Commands

- config
- del
- get
- ls
- put
- sync
- urls

## Help

Pogo provides help output at the top level by running `pogo --help`. In
addition, each of the supported commands has its own help output. For
example:

    pogo del --help

gives usage information for the del (delete) command.

>[!Note]
>Some Pogo commands support a `--force` option. This can be used to
overwrite existing files or disable prompts. Use this argument with
caution.

### Listing Endpoints

The `pogo urls` command lists all configured endpoints. To see the
contents of an endpoint (or a directory within the endpoint), use the
`pogo ls <endpoint URL>` command.

When no endpoint URL is provided, `pogo ls` behaves the same as `pogo urls`.

`pogo ls` supports several options to modify the output. Options can be
provided before or after the endpoint URL:

ls options

| Option          | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| -c, -checksum   | Print the checksum of the object.                                                |
| -l, -long       | Print the date, size, and full path to the object.                               |
| -R, -recursive  | If object is a directory, list all files in all subdirectories as well.          |
| -s, -size       | Print the size of the object in bytes (does not apply to directories).           |
| -t, -timestamp  | Print the last-modified timestamp of the object (does not apply to directories). |

>[!Note]
>You can use a shortcut URL for your Azure account. For example,
>`az://mystorageaccount/mycontainer/my/path/to/a/blob` is the same as
>`http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/to/a/blob`.

## Uploading Files

To upload a file, use `pogo put <filename> <URL>`. For example, to
upload data.zip from the local directory to the data_backups
directory:

    pogo put data.zip http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups

To give the file a different name in Azure, append the desired name:

    pogo put data.zip http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/data-20150311.zip

`pogo put` will recursively upload a directory with pogo put <directory>
<URL>. The behavior is identical to the sync behavior described below.

>[!Warning]
> If the URL ends in a /, pogo will treat it as a directory. If it does
> not, pogo will treat it as a full path. In the first example above,
> leaving off the trailing / would upload data.zip as a file named
> data_backups.

## Downloading Files

To download a file, use `pogo get <URL> [<filename>]`. For example,
to download /mycontainer/my/path/data_backups/data.zip to the local
directory:

    pogo get http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/data.zip

To save the file as data-download.zip, use the optional filename
argument:

    pogo get http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/data.zip data-download.zip

## Synchronizing Directories

The get command operates on single files. To recursively sync a
directory, use the `pogo sync` command. The source of the files is listed
first, followed by the destination. To sync the data_backups directory
from Azure to a local data_backups directory:

  pogo sync http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/ data_backups

To sync the the local data_backups directory to Azure:

  pogo sync data_backups http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/

>[!Note]
> `pogo sync` will not re-transfer unchanged objects.

## Deleting Files

To remove a file from a remote endpoint, use the pogo del command. For
example, to remove the data.zip file from the data_backups directory in
the /mycontainer/my/path/data_backups/ bucket:

  pogo del http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/data.zip

To remove an entire directory, use the --recursive option. For example,
to remove the data_backups directory in the /mycontainer/my/path/data_backups/ bucket:

  pogo del --recursive http://mystorageaccount.blob.core.windows.net/mycontainer/my/path/data_backups/

# Other pogo Commands

### config

`pogo config` is used to configure pogo endpoints. It takes no arguments or options. Use of pogo config is described in the Configuration section.

### urls

`pogo urls` is used to list the configured endpoints. It takes no arguments or options.

### cp

`pogo cp` is used to copy objects from one endpoint to another, including
the local machine. The endpoints do not have to use the same credentials
or be of the same type. The command syntax looks like `pogo [OPTIONS] cp [CP OPTIONS] <source> <destination>`. For example:

  pogo --dryrun cp --recursive az://portal12345/my_container/ s3://com.example.pogo.quickstart/my_directory

The [OPTIONS] are zero or more of the general options described in the
Options section above. [CP OPTIONS] are zero or more of the options
described in the table below.

cp options

| Option     | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| -force     | If given, files are up/downloaded even if the destination file exists.                       |
| -recursive | If object is a directory, copy all files contained in the directory and all sub-directories. |

### sign

`pogo sign` is used to generate https URLs that can be used to download a
file using a browser or command line utility like curl. Generated URLs
will be valid immediately after generation up until the duration
specified with -d/--duration, or 600 seconds by default. For example:

  pogo sign [OPTIONS] URL

### sign options

| Option     | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| -duration [INTEGER]     | The duration the signed URL is valid, in seconds.                |

## Transfer Metrics

To view transfer metrics within CycleCloud, the option must be enabled.
In Settings - CycleCloud, check the box for "Transfer Metrics":

![Transfer Metrics option](~/images/transfer_metrics.png)

Enabling this option will allow you to view transfer metrics (how many
files, how fast the transfer was, how long it took, the source
destination, etc.) from within the CycleCloud UI.

# pogo Options

In addition to command-specific options, pogo supports several common
options across all commands. These options must come *before* the
command name.

## Common Options

| Option                   | Description                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| -v, -version             | Show package version.                                                                    |
| -loglevel <level>        | Modify the logging verbosity. In order of increasing verbosity: ERROR, WARN, INFO, DEBUG |
| –config <path>           | Provide a specific ini format config file.                                               |
| -proxy <proxy URL>       | Address of the proxy server to use.                                                      |
| –proxy-port <proxy port> | Proxy server port to use.                                                                |
| -retries <N>             | Retry failed transfer attempts N times before giving up.                                 |
| -dryrun                  | Run the command without transferring or deleting anything.                               |
| -q, -quiet               | Do not print in-progress transfer status.                                                |
| -h, -help                | Show help message and exit.                                                              |

>[!Note]
> Currently, pogo only supports the use of a proxy with S3 endpoints.

# Troubleshooting

A file was not uploaded to a directory:

- Ensure that the destination URL ends with a /

URL does not match AZ pattern: AZ://BUCKET/KEY error when
listing an endpoint:

- Ensure the endpoint URL ends with a /

Empty directory was not uploaded:

- pogo will not upload empty directories

TypeError: Incorrect padding error when operating on an Azure
Storage Account:

- The Storage Account Access Key is incorrect. Re-run pogo
  config to update it.

# pogo Configuration

To use pogo, you need to configure one or more endpoints - remote
locations where objects are stored. To add your first endpoint, type
`pogo config`. This writes a configuration file to
`$HOME/.cycle/pogo.ini`. This file may be viewed or edited with a text
editor of your choice. Multiple urls that use the same credentials can
be specified in the URL(s) field separated by spaces. This corresponds
to the "Matches" line in the pogo.ini file.

Additionally, you may specify default credentials for all instances of a
storage type by leaving the URL(s) field blank. You will then be
prompted for a Section Type. The credentials you enter will then be used
for any endpoint of that storage type where an explicit configuration
doesn't exist.

## pogo.ini

The `pogo.ini` file consists of one or more sections that define an
endpoint. Sections begin with `[pogo <name>]`, and end at the beginning
of a new section OR at the end of the file. Define one setting per line,
and separate the value with an equals sign.

All sections require either `type` and `matches` to be specified. If a
`type` is specified with no `matches`, those settings will be the
default for all endpoints of that type where another explicit
configuration doesn't exist. If a `matches` setting is specified with
out a `type`, pogo will infer the type from the URL.

The common settings listed below apply to all types of endpoints.

# Common Settings

| Setting     | Description                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type        | The endpoint type. Accepted values: `az` (Azure), `fs` (file system), `gs` (Google), `rh` (remote host), or `s3` (Amazon).                                                                                                                 |
| matches     | A list of one or more comma-separated URLs for the section. URLs for a given section should all share a common protocol, e.g. az//bucket-a, az://bucket-b, az://bucket-c/with_prefix/                                                      |

You can also add encryption keys to the pogo.ini. To specify a default
key, add the key name and encryption mode as per the sample below:

    [[encryptionkeys]]
    ExampleKey = 7468697369736173616d706c656b6579

    [[pogo ExampleSection]]
    type = az
    encryption_mode = pogo
    encryption_keyname = ExampleKey

Keys are in string hex format, and by default the system creates 128-bit
keys. To use 192 or 256 bit keys, you will need the Java Cryptography
Extension (JCE) Unlimited Strength Jurisdiction Policy Files (or
whatever is analogous for your JVM). Creating 192 or 256-bit keys is not
yet supported - if you wish to use either, you will need to generate
your own key(s).

## Microsoft Azure Settings (az)

| Setting             | Description                                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| subscription_id     | Your Azure Subscription ID, e.g. 55555555-5555-5555-5555-555555555555                                                                                                                                         |
| tenant_id           | Your Azure Tenant ID, e.g. 66666666-6666-6666-6666-666666666666                                                                                                                                               |
| application_id      | Your Azure Application ID, e.g. 77777777-7777-7777-7777-777777777777                                                                                                                                          |
| application_secret  | Your Azure Application Secret, e.g. U3VjaCBhbiBpbnF1aXNpdGl2ZSBtaW5kIQ==                                                                                                                                      |
| certificate_file    | A file containing the PEM formatted subscription certificate, e.g. ~/myazurefiles/subscription.pem                                                                                                            |
| certificate         | A string-escaped version of the PEM formatted subscription certificate, e.g. —–BEGIN RSA PRIVATE KEY—–nMIIEG8konNbv7FQ==n—–END RSA PRIVATE KEY—–n—–BEGIN CERTIFICATE—–nMIICe4RTnBgNVVh/7n—–END CERTIFICATE—–n |
| storage_account     | The name of the Azure storage account being accessed. Only necessary when using access_key authentication.                                                                                                    |
| access_key          | The Azure storage account access key, e.g. Q29uZ3JhdHVsYXRpb25zISBZb3VyIGN1cmlvc2l0eSBrbm93cyBubyBib3VuZHMh                                                                                                   |

>[!Note]
>There are four different configurations for Azure credentials:

Valid Azure Credentials

1.  `storage_account` and `access_key`
2.  `subscription_id`, `tenant_id`, `application_id`, and
    `application_secret`
3.  `subscription_id` and `certificate_file`
4.  `subscription_id` and `certificate`

## Google Cloud Storage Settings (gs)

| Setting           | Description                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| client_email      | The GCP Client email for service account authentication, e.g. 555555555555-abcdefgh1ijklmnop2qrstuvwx3yz4@developer.gserviceaccount.com          |
| private_key       | A string-escaped version of the PEM formatted service account private key, e.g. —–BEGIN PRIVATE KEY—–nMIICjsnBxr89nRUFvEbvAn—–END PRIVATE KEY—–n |
| client_id         | The GCP Client ID for native application, e.g. 707591534183.apps.googleusercontent.com                                                           |
| client_secret     | The GCP Client Secret for native application, e.g. 6wu4nDpgB_bVeLcFEu_n9ZDco                                                                     |
| project           | The GCP project ID. Only necessary when the client_email is absent or doesn't encode the project ID.                                             |
| default_location  | The region to create new buckets in, e.g. us-east1.                                                                                              |

## Remote Host Settings (rh)

| Setting             | Description                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| protocol            | The protocol to communicate with the remote host. Currently only 'ssh' is supported.                                                                                     |
| hostname            | The remote host to connect to, e.g. example_host_1.example_domain.com.                                                                                                   |
| port                | The port to communicate over, e.g. 22                                                                                                                                    |
| username            | The username to authenticate with for SSH.                                                                                                                               |
| password            | The password to authenticate with for SSH, when not using key_file.                                                                                                      |
| key_file            | The private key file to authenticate with for SSH, e.g. ~/.ssh/id_rsa.                                                                                                   |
| pogo_path           | The absolute path to pogo on the remote host, e.g. /usr/local/bin/pogo                                                                                                   |
| aux_port            | A port the remote host will use to provide additional channels. A value of 0 indicates a random port, while negative values will disable aux connections. Defaults to 0. |
| connection_timeout  | How long to attempt to connect to the remote host before giving up.                                                                                                      |

## Amazon Web Services Storage (s3)

| Setting                       | Description                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| access_key                    | The AWS access key, e.g. AKIASEPHIAISACAR                                                                                                                                                              |
| secret_key                    | The AWS secret key, e.g. Geig1chahvaaCh8elohwoogai0aikohW7zek5quoh                                                                                                                                     |
| use_instance_creds            | If = true, the machine's instance role credentials will be used instead of any access_key/secret_key. Defaults to false.                                                                               |
| default_region                | The AWS region to use, e.g. us-west-1                                                                                                                                                                  |
| endpoint                      | The specific AWS endpoint to use, e.g. s3-us-west-1-amazonaws.com                                                                                                                                      |
| signing_method                | The request signing method to use: 'aws-v2' or 'aws-v4'. Defaults to 'aws-v4'.                                                                                                                         |
| server_side_encryption        | If = true, S3 SSE will be enabled. Defaults to false.                                                                                                                                                  |
| server_side_encryption_key    | If S3 SSE is enabled, a specific key can be specified (e.g.arn:aws:kms:us-east-1:555555555555:key/55555555-5555-5555-5555-555555555555). If no key is specified, the default AWS KMS key will be used. |
| reduced_redundancy            | If = true, the storage class of reduced redundancy will be used. Defaults to false.                                                                                                                    |
| ssl_enabled                   | If = false, unencrypted HTTP requests will be used to transfer files. Defaults to true.                                                                                                                |

  >[!Note]
  >The AWS region or endpoint does not need to be specified unless the IAM credentials do not allow >automatic endpoint discovery. When both default_region and endpoint are specified, endpoint takes >precedence.

## File System Settings (fs)

Attributes that apply to file system endpoints only can be added as a
`[pogo default-fs]` section such as:

    [pogo default-fs]
      type = fs
      follow_links = true

If `follow_links` attribute = true, listing or copying from a file
system will include or transverse into symbolic links.

## `[pogo]`

Your `pogo.ini` file can begin with a `[pogo]` section that contains
attributes to be cascaded down through the other sections. The `[pogo]`
section cannot contain `type` or `matches`, but can use the following
settings (which can also be used in specific endpoint sections):

| Setting     | Description                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| proxy       | The HTTP proxy to use, e.g. http://username:password@proxy.example.com:8080                                                                                                                                                                |
| proxy_user  | The HTTP proxy user. This overrides any user which may have been specified in proxy.                                                                                                                                                       |
| proxy_pass  | The HTTP proxy password. This overrides any password which may have been specified in proxy.                                                                                                                                               |
| proxy_host  | The HTTP proxy hostname. This overrides any hostname which may have been specified in proxy.                                                                                                                                               |
| proxy_port  | The HTTP proxy port. This overrides any port which may have been specified in proxy.                                                                                                                                                       |
| retries     | The number of times each internal operation (read/write/query) is retried prior to giving up. For example, a multipart file transfer with a retry setting of 3 will try the read operation of each part 3 times prior to failing the file. |

# Prerequisites

## System Requirements

To install CycleCloud, you must have administrator rights. In addition, your system needs to meet the following minimum requirements:

* A 32-bit or 64-bit Linux distribution or Windows Server 2008 or newer

* Java Runtime Environment (version 8 or higher)

* At least 8GB of RAM

* Two or more CPU cores

* At least 50GB of free disk space

* Administrator (root) privileges

* Phraseless SSH key

> [!NOTE]
> CycleCloud may be installed on physical or virtualized hardware.

## Cycle Computing Portal Account

A Cycle Computing Portal Account allows you to access downloads and
licenses associated with your account. If you do not have a Portal
Account, please contact your rep or email <info@cyclecomputing.com> for
assistance.

## SSH Key

You will need to generate your own SSH key for use in CycleCloud. This
key is used by the cycle\_server user, and must be accessible to that
account. To do this, run the following:

    # Ensure your .ssh directory exists
    $> mkdir -p ~/.ssh
    # Generate the key pair
    $> ssh-keygen -f ~/.ssh/cyclecloud -t rsa -b 2048
    # Do not enter a passphrase to allow CycleCloud's automated processes to work.
    # Rename the private key to have a .pem extension
    $> mv ~/.ssh/cyclecloud ~/.ssh/cyclecloud-private.pem


> [!WARNING]
> Use a phraseless SSH key. If you enter a passphrase when generating your SSH key, the return proxy feature of CycleCloud will not work, which may cause node reporting and autoscaling to fail.

## Logging into CycleCloud

Your administrator will provide you with a user name and password for CycleCloud, as well as the URL to access CycleCloud via your web browser. Upon logging in for the first time, you may be prompted to change your password.

### Account Lockout

Your account will be locked out for 5 minutes after five unsuccessful login attempts. Should you be unable to access your account at all, contact your administrator to reset your password.

# Prerequisites

## System

For this exercise, you will need root or sudo access. In addition, your
system needs to meet the following minimum requirements:

  - Linux 64-bit operating system (Centos 6, Ubuntu 12.04 LTS, Ubuntu
    14.04 LTS, etc.)
  - Java Runtime Environment (version 8 or higher)
  - 8GB System Memory
  - 10GB Free Disk Space

> Note: CycleCloud may be installed on physical or virtualized hardware.

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


> Warning: Use a phraseless SSH key. If you enter a passphrase when generating your SSH key, the return proxy feature of CycleCloud will not work, which may cause node reporting and autoscaling to fail.

Once you have generated the SSH key pair, you will need to import the
key to your cloud provider if you are using Google Cloud or Amazon Web
Services as your cloud service provider. This step is not required for
Microsoft Azure use.

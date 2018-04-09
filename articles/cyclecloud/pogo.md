# pogo

This document is a comprehensive guide to Azure CycleCloud's **pogo** (put
object/get object) tool for command line file transfers.

pogo (PUT Object, GET Object) is a command-line tool for interacting
with various object stores. It supports cloud provider storage and mounted
filesystems. One of the main benefits of Pogo is that it supports
parallel downloads and uploads, which greatly increases throughput.

This guide assumes that you are familiar with basic command line usage,
that you already have a cloud service provider (CSP) account, that you
have access to the CSP console, and that you are not behind a firewall
that will block direct access to CSP services.

## System Requirements

pogo is supported on the following operating systems:

  - Linux
  - Windows
  - OS X

>[!Note]
> For OS X and 32-bit Linux systems, having Python and the pip package
> manager installed is strongly encouraged. The rest of this guide
> assumes pip is available.

## Cloud Provider Prerequisites

### Azure

For pogo, you will need to have the following:

  - Azure Storage Account and Access Key
  - At least one container in your Azure Storage Account

### Amazon Web Services

For pogo, you will need to have the following:

  - Amazon Access Key and Secret Key
  - An S3 bucket

### Google Cloud

You will need to have the following:

  - Membership in a GC project
  - A Client ID and Client secret pair from GC Client ID for native
    application within that project
  - A GC Storage bucket

## pogo Installation

To install pogo, follow the instructions for your operating system.

### Linux (64-bit)

  - Download the provided tarball and extract it: tar xf
    pogo-cli-version.linux64.tar.gz
  - (optional) Copy the pogo executable to /usr/local/bin or another
    location within your PATH environment variable. The rest of this
    guide assumes the executable is in your PATH.

### Windows (64-bit)

  - Download the provided zip file and extract it.
  - (optional) Copy the pogo executable to a location within the Windows
    PATH environment variable. The rest of this guide assumes the
    executable is in your current working directory or in the PATH.

### Other Operating Systems

  - Download the provided tarball
  - Install with pip: pip install pogo-cli.tar.gz

>[!Note]
> Installation with pip may require root/Administrator privileges.

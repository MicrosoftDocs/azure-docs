---
title: Azure CycleCloud pogo Introduction | Microsoft Docs
description: Installing and using Azure CycleCloud's pogo tool.
author: KimliW
ms.technology: jetpack
ms.date: 08/01/2018
ms.author: adjohnso
---

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

## Prerequisites

For pogo, you will need to have the following:

  - Azure Storage Account and Access Key
  - At least one container in your Azure Storage Account

## pogo Installation

pogo is installed along with the [CycleCloud CLI](install-cyclecloud-cli.md). 

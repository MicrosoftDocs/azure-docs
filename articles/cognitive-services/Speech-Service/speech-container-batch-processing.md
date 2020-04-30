---
title: Batch processing kit for Speech containers
titleSuffix: Azure Cognitive Services
description: Use the Batch processing kit to scale Speech container requests. 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: aahi
---

# Batch processing kit for Speech containers

Use the batch processing kit to complement and scale out workloads on Speech containers. Available as a container, this open-source utility helps facilitate batch transcription for large numbers of audio files, across any number of on-premises and cloud-based speech container endpoints. 

| Feature  | Description  |
|---------|---------|
| Automatically distribute batches of audio files     | Automatically dispatch files to large numbers of Speech Services endpoints.         |
| Use multiple endpoint types     | Use on-premisis or cloud-based endpoints, in any ratio.         |
|Run modes     | Run the batch client once, continuously in the background, or create HTTP endpoints for audio files.         |
|POSIX compatibility     | Mount any POSIX-compliant volume, including network filesystems.        |

The container is publicly available on GitHub. You are only [billed](speech-container-howto.md#billing) for the Speech containers you use.

## Endpoint configuration

The batch client takes a yaml configuration file that specifies the on-prem container endpoints. The following example can be written to `/mnt/my_nfs/config.yaml`, which is used in the examples below. 

```yaml
MyContainer1: 
  concurrency: 5 
  host: 192.168.0.100 
  port: 5000 
  rtf: 3 
MyContainer2: 
  concurrency: 5 
  host: BatchVM0.corp.redmond.microsoft.com 
  port: 5000 
  rtf: 2 
MyContainer3: 
  concurrency: 10 
  host: localhost 
  port: 6001 
  rtf: 4 
```

This yaml example specifies three speech containers on three hosts. The first host is specified by a IPv4 address, the second is running on the same VM as the batch-client, and the third container is specified by the DNS hostname of another VM. The `concurrency` value specifies the maximum concurrent file transcriptions that can run on the same container. The `rtf` (Real-Time Factor) value is optional, and can be used to tune performance.
 
The batch client can dynamically detect if an endpoint becomes unavailable (for example, due to a container restart or networking issue), and when it becomes available again. Transcription requests will not be sent to containers that are unavailable, and the client will continue using other available containers. You can add, remove, or edit endpoints at any time without interrupting the progress of your batch.


## Run the batch processing container
  
> [!NOTE] 
> * This example uses the same directory (`/my_nfs`) for the configuration file and the inputs, outputs, and logs directories. You can use hosted or NFS-mounted directories for these folders.
> * Running the client with `–h` will list the available command-line parameters, and their default values. 

Use the Docker `run` command to start the container. This will start an interactive shell inside the container.

```Docker
docker run --rm -ti -v  /mnt/my_nfs:/my_nfs --entrypoint /bin/bash /mnt/my_nfs:/my_nfs markopoc.azurecr.io/scratch/onprem/batch-client:0.7.3  
```

To run the batch client:  

```Docker
run-batch-client -config /my_nfs/config.yaml -input_folder /my_nfs/audio_files -output_folder /my_nfs/transcriptions -log_folder  /my_nfs/logs -log_level DEBUG -nbest 1 -m ONESHOT -diarization  None -language en-US -strict_config   
```

To run the batch client and container in a single command:

```Docker
docker run --rm -ti -v  /mnt/my_nfs:/my_nfs markopoc.azurecr.io/scratch/onprem/batch-client:0.7.3  -config /my_nfs/config.yaml -input_folder /my_nfs/audio_files -output_folder /my_nfs/transcriptions -log_folder  /my_nfs/logs -log_level DEBUG -nbest 1 -m ONESHOT -diarization  None -language en-US -strict_config   
```

The client will start running. If an audio file has already been transcribed in a previous run, the client will automatically skip the file. Files are sent with an automatic retry if transient errors occur, and you can differentiate between which errors you want to the client to retry on. On a transcription error, the client will continue transcription, and can retry without losing progress.  

## Run modes 

The batch processing kit offers three modes:


|Mode  |Description  |
|---------|---------|
|ONESHOT mode      | Transcribes a single batch of audio files (from an input directory and optional file list) to an output folder.         |
|DAEMON mode     | Transcribes existing files in a given folder, and continuously transcribes new audio files as they are added.          |
|APISERVER mode    | Provides a basic set of HTTP endpoints that can be used for audio file batch submission, status checking, and long polling. Also enables programmatic consumption using a python module extension, or importing as a submodule.          |

## Logging

> [!NOTE]
> The batch client may overwrite the *run.log* file periodically if it gets too large.

The client creates a *run.log* file in the directory specified by the `-log_folder` argument in the docker `run` command. Logs are captured at the DEBUG level by default. The same logs are sent to the `stdout/stderr`, and filtered depending on the `-log_level` argument. This log is only necessary for debugging, or if you need to send a trace for support. The logging folder also contains the Speech SDK logs for each audio file.

The output directory specified by `-output_folder` will contain a *run_summary.json* file, which is periodically rewritten every 30 seconds or whenever new transcriptions are finished. You can use this file to check on progress as the batch proceeds. It will also contain the final run statistics and final status of every file when the batch is completed. The batch is completed when the process has a clean exit. 

## Next steps

* [How to install and run containers](speech-container-howto.md)
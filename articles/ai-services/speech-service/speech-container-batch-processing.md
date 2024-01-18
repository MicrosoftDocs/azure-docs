---
title: Batch processing kit for Speech containers
titleSuffix: Azure AI services
description: Use the Batch processing kit to scale Speech container requests. 
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 10/22/2020
ms.author: eur
---

# Batch processing kit for Speech containers

Use the batch processing kit to complement and scale out workloads on Speech containers. Available as a container, this open-source utility helps facilitate batch transcription for large numbers of audio files, across any number of on-premises and cloud-based speech container endpoints. 

:::image type="content" source="media/containers/general-diagram.png" alt-text="A diagram showing an example batch-kit container workflow.":::

The batch kit container is available for free on [GitHub](https://github.com/microsoft/batch-processing-kit) and   [Docker hub](https://hub.docker.com/r/batchkit/speech-batch-kit/tags). You are only [billed](speech-container-overview.md#billing) for the Speech containers you use.

| Feature  | Description  |
|---------|---------|
| Batch audio file distribution     | Automatically dispatch large numbers of files to on-premises or cloud-based Speech container endpoints. Files can be on any POSIX-compliant volume, including network filesystems.       |
| Speech SDK integration | Pass common flags to the Speech SDK, including: n-best hypotheses, diarization, language, profanity masking.  |
|Run modes     | Run the batch client once, continuously in the background, or create HTTP endpoints for audio files.         |
| Fault tolerance | Automatically retry and continue transcription without losing progress, and differentiate between which errors can, and can't be retried on. |
| Endpoint availability detection | If an endpoint becomes unavailable, the batch client will continue transcribing, using other container endpoints. After becoming available again, the client will automatically begin using the endpoint.   |
| Endpoint hot-swapping | Add, remove, or modify Speech container endpoints during runtime without interrupting the batch progress. Updates are immediate. |
| Real-time logging | Real-time logging of attempted requests, timestamps, and failure reasons, with Speech SDK log files for each audio file. |

## Get the container image with `docker pull`

Use the [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) command to download the latest batch kit container.

[!INCLUDE [pull-image-include](../../../includes/pull-image-include.md)]

```bash
docker pull docker.io/batchkit/speech-batch-kit:latest
```

## Endpoint configuration

The batch client takes a yaml configuration file that specifies the on-premises container endpoints. The following example can be written to `/mnt/my_nfs/config.yaml`, which is used in the examples below. 











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

This yaml example specifies three speech containers on three hosts. The first host is specified by a IPv4 address, the second is running on the same VM as the batch-client, and the third container is specified by the DNS hostname of another VM. The `concurrency` value specifies the maximum concurrent file transcriptions that can run on the same container. The `rtf` (Real-Time Factor) value is optional and can be used to tune performance.

The batch client can dynamically detect if an endpoint becomes unavailable (for example, due to a container restart or networking issue), and when it becomes available again. Transcription requests will not be sent to containers that are unavailable, and the client will continue using other available containers. You can add, remove, or edit endpoints at any time without interrupting the progress of your batch.













































































































































































































































































































































































































































































## Run the batch processing container
  
> [!NOTE] 
> * This example uses the same directory (`/my_nfs`) for the configuration file and the inputs, outputs, and logs directories. You can use hosted or NFS-mounted directories for these folders.
> * Running the client with `–h` will list the available command-line parameters, and their default values. 
> * The batch processing container is only supported on Linux.

Use the Docker `run` command to start the container. This will start an interactive shell inside the container.








































































































































































```bash
docker run --network host --rm -ti -v /mnt/my_nfs:/my_nfs --entrypoint /bin/bash /mnt/my_nfs:/my_nfs docker.io/batchkit/speech-batch-kit:latest
```

To run the batch client:  









































```bash
run-batch-client -config /my_nfs/config.yaml -input_folder /my_nfs/audio_files -output_folder /my_nfs/transcriptions -log_folder /my_nfs/logs -file_log_level DEBUG -nbest 1 -m ONESHOT -diarization None -language en-US -strict_config
```

To run the batch client and container in a single command:








































































































































































```bash
docker run --network host --rm -ti -v /mnt/my_nfs:/my_nfs docker.io/batchkit/speech-batch-kit:latest -config /my_nfs/config.yaml -input_folder /my_nfs/audio_files -output_folder /my_nfs/transcriptions -log_folder /my_nfs/logs
```











The client will start running. If an audio file has already been transcribed in a previous run, the client will automatically skip the file. Files are sent with an automatic retry if transient errors occur, and you can differentiate between which errors you want to the client to retry on. On a transcription error, the client will continue transcription, and can retry without losing progress.  

## Run modes 

The batch processing kit offers three modes, using the `--run-mode` parameter.

#### [Oneshot](#tab/oneshot)

`ONESHOT` mode transcribes a single batch of audio files (from an input directory and optional file list) to an output folder.

:::image type="content" source="media/containers/batch-oneshot-mode.png" alt-text="A diagram showing the batch-kit container processing files in oneshot mode.":::

1. Define the Speech container endpoints that the batch client will use in the `config.yaml` file. 
2. Place audio files for transcription in an input directory.  
3. Invoke the container on the directory, which will begin processing the files. If the audio file has already been transcribed in a previous run with the same output directory (same file name and checksum), the client will skip the file. 
4. The files are dispatched to the container endpoints from step 1.
5. Logs and the Speech container output are returned to the specified output directory. 

#### [Daemon](#tab/daemon)

> [!TIP]
> If multiple files are added to the input directory at the same time, you can improve performance by instead adding them in a regular interval.

`DAEMON` mode transcribes existing files in a given folder, and continuously transcribes new audio files as they are added.          

:::image type="content" source="media/containers/batch-daemon-mode.png" alt-text="A diagram showing batch-kit container processing files in daemon mode.":::

1. Define the Speech container endpoints that the batch client will use in the `config.yaml` file. 
2. Invoke the container on an input directory. The batch client will begin monitoring the directory for incoming files. 
3. Set up continuous audio file delivery to the input directory. If the audio file has already been transcribed in a previous run with the same output directory (same file name and checksum), the client will skip the file. 
4. Once a file write or POSIX signal is detected, the container is triggered to respond.
5. The files are dispatched to the container endpoints from step 1.
6. Logs and the Speech container output are returned to the specified output directory. 

#### [REST](#tab/rest)

`REST` mode is an API server mode that provides a basic set of HTTP endpoints for audio file batch submission, status checking, and long polling. Also enables programmatic consumption using a Python module extension or importing as a submodule.

:::image type="content" source="media/containers/batch-rest-api-mode.png" alt-text="A diagram showing the batch-kit container processing files in REST mode.":::

1. Define the Speech container endpoints that the batch client will use in the `config.yaml` file. 
2. Send an HTTP request to one of the API server's endpoints.
  
    |Endpoint  |Description  |
    |---------|---------|
    |`/submit`     | Endpoint for creating new batch requests.        |
    |`/status`     | Endpoint for checking the status of a batch request. The connection will stay open until the batch completes.       |
    |`/watch`     | Endpoint for using HTTP long polling until the batch completes.        |

3. Audio files are uploaded from the input directory. If the audio file has already been transcribed in a previous run with the same output directory (same file name and checksum), the client will skip the file. 
4. If a request is sent to the `/submit` endpoint, the files are dispatched to the container endpoints from step
5. Logs and the Speech container output are returned to the specified output directory. 

---
## Logging

> [!NOTE]
> The batch client may overwrite the *run.log* file periodically if it gets too large.

The client creates a *run.log* file in the directory specified by the `-log_folder` argument in the docker `run` command. Logs are captured at the DEBUG level by default. The same logs are sent to the `stdout/stderr`, and filtered depending on the `-file_log_level` or `console_log_level` arguments. This log is only necessary for debugging, or if you need to send a trace for support. The logging folder also contains the Speech SDK logs for each audio file.

The output directory specified by `-output_folder` will contain a *run_summary.json* file, which is periodically rewritten every 30 seconds or whenever new transcriptions are finished. You can use this file to check on progress as the batch proceeds. It will also contain the final run statistics and final status of every file when the batch is completed. The batch is completed when the process has a clean exit. 

## Next steps

* [How to install and run containers](speech-container-howto.md)








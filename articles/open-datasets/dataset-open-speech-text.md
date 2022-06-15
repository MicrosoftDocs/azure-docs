---
title: Russian Open Speech To Text
description: Learn how to use the Russian Open Speech To Text dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# Russian Open Speech To Text

A collection of speech samples derived from various audio sources. The dataset contains short audio clips in Russian.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

This Russian speech to text (STT) dataset includes:
- ~16 million utterances
- ~20,000 hours
- 2.3 TB (uncompressed in .wav format in int16), 356G in opus
- All files were transformed to opus, except for validation datasets

The main purpose of the dataset is to train speech-to-text models.

## Dataset composition

Dataset size is given for .wav files.

| DATASET | UTTERANCES | HOURS | GB | SECS/CHARS | COMMENT | ANNOTATION | QUALITY/NOISE |
|-|-|-|-|-|-|-|-|
| radio_v4 (*) | 7,603,192 | 10,430 | 1,195 | 5s / 68 | Radio | Align | 95% / crisp |
| public_speech (*) | 1,700,060 | 2,709 | 301 | 6s / 79 | Public speech | Align | 95% / crisp |
| audiobook_2 | 1,149,404 | 1,511 | 162 | 5s / 56 | Books | Align | 95% / crisp |
| radio_2 | 651,645 | 1,439 | 154 | 8s / 110 | Radio | Align | 95% / crisp |
| public_youtube1120 | 1,410,979 | 1,104 | 237 | 3s / 34 | Youtube | Subtitles | 95% / ~crisp |
| public_youtube700 | 759,483 | 701 | 75 | 3s / 43 | Youtube | Subtitles | 95% / ~crisp |
| tts_russian_addresses | 1,741,838 | 754 | 81 | 2s / 20 | Addresses | TTS 4 voices | 100% / crisp |
| asr_public_phone_calls_2 | 603,797 | 601 | 66 | 4s / 37 | Phone calls | ASR | 70% / noisy |
| public_youtube1120_hq | 369,245 | 291 | 31 | 3s / 37 | YouTube HQ | Subtitles | 95% / ~crisp |
| asr_public_phone_calls_1 | 233,868 | 211 | 23 | 3s / 29 | Phone calls | ASR | 70% / noisy |
| radio_v4_add (*) | 92,679 | 157 | 18 | 6s / 80 | Radio | Align | 95% / crisp |
| asr_public_stories_2 | 78,186 | 78 | 9 | 4s / 43 | Books | ASR | 80% / crisp |
| asr_public_stories_1 | 46,142 | 38 | 4 | 3s / 30 | Books | ASR | 80% / crisp |
| public_series_1 | 20,243 | 17 | 2 | 3s / 38 | Youtube | Subtitles | 95% / ~crisp |
| asr_calls_2_val | 12,950 | 7,7 | 2 | 2s / 34 | Phone calls | Manual annotation | 99% / crisp |
| public_lecture_1 | 6,803 | 6 | 1 | 3s / 47 | Lectures | Subtitles | 95% / crisp |
| buriy_audiobooks_2_val | 7,850 | 4,9 | 1 | 2s / 31 | Books | Manual annotation | 99% / crisp |
| public_youtube700_val | 7,311 | 4,5 | 1 | 2s / 35 | Youtube | Manual annotation | 99% / crisp |

(*) Only a sample of data is provided with txt files.

## Annotation methodology

The dataset is compiled using open sources. Long sequences are split into audio chunks using voice activity detection and alignment. Some audio types are annotated automatically and verified statistically by using heuristics.

## Data volumes and update frequency

The total size of the dataset is 350 GB. The total size of the dataset with publicly shared labels is 130 GB.

The dataset itself is not likely to be updated for backwards compatibility. Follow the original repository for benchmarks and exclude files.

New domains and languages may be added in future.

## Audio normalization

All files are normalized for easier and faster runtime augmentations. Processing is as follows:

- Converted to mono, if necessary;
- Converted to 16-kHz sampling rate, if necessary;
- Stored as 16-bit integers;
- Converted to OPUS;

## On disk DB methodology

Each audio file (wav, binary) is hashed. The hash is used to create a folder hierarchy for more optimal fs operation.

```python
target_format = 'wav'
wavb = wav.tobytes()

f_hash = hashlib.sha1(wavb).hexdigest()

store_path = Path(root_folder,
                  f_hash[0],
                  f_hash[1:3],
                  f_hash[3:15] + '.' + target_format)
```

## Downloads

The dataset is provided in two forms:

- Archives available via Azure blob storage and/or direct links;
- Original files available via Azure blob storage;
Everything is stored in 'https://azureopendatastorage.blob.core.windows.net/openstt/'

Folder structure:

```
└── ru_open_stt_opus                                            <= archived folders
│   │
│   ├── archives
│   │    ├── asr_calls_2_val.tar.gz                             <= tar.gz archives with opus and wav files
│   │    │   ...                                                <= see the below table for enumeration
│   │    └── tts_russian_addresses_rhvoice_4voices.tar.gz
│   │
│   └── manifests
│        ├── asr_calls_2_val.csv                                <= csv files with wav_path, text_path, duration (see notebooks)
│        │   ...
│        └── tts_russian_addresses_rhvoice_4voices.csv
│
└── ru_open_stt_opus_unpacked                                   <= a separate folder for each uploaded domain
    ├── public_youtube1120
    │    ├── 0                                                  <= see "On disk DB methodology" for details
    │    ├── 1
    │    │   ├── 00
    │    │   │  ...
    │    │   └── ff
    │    │        ├── *.opus                                   <= actual files
    │    │        └── *.txt
    │    │   ...
    │    └── f
    │
    ├── public_youtube1120_hq
    ├── public_youtube700_val
    ├── asr_calls_2_val
    ├── radio_2
    ├── private_buriy_audiobooks_2
    ├── asr_public_phone_calls_2
    ├── asr_public_stories_2
    ├── asr_public_stories_1
    ├── public_lecture_1
    ├── asr_public_phone_calls_1
    ├── public_series_1
    └── public_youtube700
```

| DATASET | GB, WAV | GB, ARCHIVE | ARCHIVE | SOURCE | MANIFEST |
|-|-|-|-|-|-|
| Train |  |  |  |  |  |
| Radio and public speech sample | - | 11.4 | opus+txt | - | manifest |
| audiobook_2 | 162 | 25.8 | opus+txt | Internet + alignment | manifest |
| radio_2 | 154 | 24.6 | opus+txt | Radio | manifest |
| public_youtube1120 | 237 | 19.0 | opus+txt | YouTube videos | manifest |
| asr_public_phone_calls_2 | 66 | 9.4 | opus+txt | Internet + ASR | manifest |
| public_youtube1120_hq | 31 | 4.9 | opus+txt | YouTube videos | manifest |
| asr_public_stories_2 | 9 | 1.4 | opus+txt | Internet + alignment | manifest |
| tts_russian_addresses_rhvoice_4voices | 80.9 | 12.9 | opus+txt | TTS | manifest |
| public_youtube700 | 75.0 | 12.2 | opus+txt | YouTube videos | manifest |
| asr_public_phone_calls_1 | 22.7 | 3.2 | opus+txt | Internet + ASR | manifest |
| asr_public_stories_1 | 4.1 | 0.7 | opus+txt | Public stories | manifest |
| public_series_1 | 1.9 | 0.3 | opus+txt | Public series | manifest |
| public_lecture_1 | 0.7 | 0.1 | opus+txt | Internet + manual | manifest |
| Val |  |  |  |  |  |
| asr_calls_2_val | 2 | 0.8 | wav+txt | Internet | manifest |
| buriy_audiobooks_2_val | 1 | 0.5 | wav+txt | Books + manual | manifest |
| public_youtube700_val | 2 | 0.13 | wav+txt | YouTube videos + manual | manifest |

## Download instructions

### Direct download

For instructions on how to download the dataset directly, see the [GitHub download instructions page](https://github.com/snakers4/open_stt#download-instructions).

## Additional information

For help or questions about the data contact the data author(s) at aveysov@gmail.com

This license allows users to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. It includes the following elements:
* BY – Credit must be given to the creator
* NC – Only noncommercial uses of the work are permitted

CC-BY-NC and commercial usage available after agreement with dataset authors.

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=open-speech-to-text -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=open-speech-to-text)**.

## Helper functions / dependencies

### Building libsndfile

An efficient way to read opus files in Python that doesn't incur significant overhead is to use pysoundfile (a Python CFFI wrapper around libsoundfile).

Opus support has been implemented upstream, but it has not been properly released. Therefore, we opted for custom build + monkey patching.

Typically, you need to run this in your shell with sudo access:

```bash
apt-get update
apt-get install cmake autoconf autogen automake build-essential libasound2-dev \
libflac-dev libogg-dev libtool libvorbis-dev libopus-dev pkg-config -y

cd /usr/local/lib
git clone https://github.com/erikd/libsndfile.git
cd libsndfile
git reset --hard 49b7d61
mkdir -p build && cd build

cmake .. -DBUILD_SHARED_LIBS=ON
make && make install
cmake --build .
```
### Helper functions / dependencies

Install the following libraries:

```
pandas
numpy
scipy
tqdm
soundfile
librosa
```

Manifests are csv files with the following columns:

- Path to audio
- Path to text file
- Duration

They proved to be the simplest format of accessing data.

For ease of use, all the manifests are already rerooted. All paths in them are relative, you need to provide a root folder.

```python
# manifest utils
import os
import numpy as np
import pandas as pd
from tqdm import tqdm
from urllib.request import urlopen


def reroot_manifest(manifest_df,
                    source_path,
                    target_path):
    if source_path != '':
        manifest_df.wav_path = manifest_df.wav_path.apply(lambda x: x.replace(source_path,
                                                                              target_path))
        manifest_df.text_path = manifest_df.text_path.apply(lambda x: x.replace(source_path,
                                                                                target_path))
    else:
        manifest_df.wav_path = manifest_df.wav_path.apply(lambda x: os.path.join(target_path, x))
        manifest_df.text_path = manifest_df.text_path.apply(lambda x: os.path.join(target_path, x))    
    return manifest_df


def save_manifest(manifest_df,
                  path,
                  domain=False):
    if domain:
        assert list(manifest_df.columns) == ['wav_path', 'text_path', 'duration', 'domain']
    else:
        assert list(manifest_df.columns) == ['wav_path', 'text_path', 'duration']

    manifest_df.reset_index(drop=True).sort_values(by='duration',
                                                   ascending=True).to_csv(path,
                                                                          sep=',',
                                                                          header=False,
                                                                          index=False)
    return True


def read_manifest(manifest_path,
                  domain=False):
    if domain:
        return pd.read_csv(manifest_path,
                        names=['wav_path',
                               'text_path',
                               'duration',
                               'domain'])
    else:
        return pd.read_csv(manifest_path,
                        names=['wav_path',
                               'text_path',
                               'duration'])


def check_files(manifest_df,
                domain=False):
    orig_len = len(manifest_df)
    if domain:
        assert list(manifest_df.columns) == ['wav_path', 'text_path', 'duration']
    else:
        assert list(manifest_df.columns) == ['wav_path', 'text_path', 'duration', 'domain']
    wav_paths = list(manifest_df.wav_path.values)
    text_path = list(manifest_df.text_path.values)

    omitted_wavs = []
    omitted_txts = []

    for wav_path, text_path in zip(wav_paths, text_path):
        if not os.path.exists(wav_path):
            print('Dropping {}'.format(wav_path))
            omitted_wavs.append(wav_path)
        if not os.path.exists(text_path):
            print('Dropping {}'.format(text_path))
            omitted_txts.append(text_path)

    manifest_df = manifest_df[~manifest_df.wav_path.isin(omitted_wavs)]
    manifest_df = manifest_df[~manifest_df.text_path.isin(omitted_txts)]
    final_len = len(manifest_df)

    if final_len != orig_len:
        print('Removed {} lines'.format(orig_len-final_len))
    return manifest_df


def plain_merge_manifests(manifest_paths,
                          MIN_DURATION=0.1,
                          MAX_DURATION=100):

    manifest_df = pd.concat([read_manifest(_)
                             for _ in manifest_paths])
    manifest_df = check_files(manifest_df)

    manifest_df_fit = manifest_df[(manifest_df.duration>=MIN_DURATION) &
                                  (manifest_df.duration<=MAX_DURATION)]

    manifest_df_non_fit = manifest_df[(manifest_df.duration<MIN_DURATION) |
                                      (manifest_df.duration>MAX_DURATION)]

    print(f'Good hours: {manifest_df_fit.duration.sum() / 3600:.2f}')
    print(f'Bad hours: {manifest_df_non_fit.duration.sum() / 3600:.2f}')

    return manifest_df_fit


def save_txt_file(wav_path, text):
    txt_path = wav_path.replace('.wav','.txt')
    with open(txt_path, "w") as text_file:
        print(text, file=text_file)
    return txt_path


def read_txt_file(text_path):
    #with open(text_path, 'r') as file:
    response = urlopen(text_path)
    file = response.readlines()
    for i in range(len(file)):
        file[i] = file[i].decode('utf8')
    return file 

def create_manifest_from_df(df, domain=False):
    if domain:
        columns = ['wav_path', 'text_path', 'duration', 'domain']
    else:
        columns = ['wav_path', 'text_path', 'duration']
    manifest = df[columns]
    return manifest


def create_txt_files(manifest_df):
    assert 'text' in manifest_df.columns
    assert 'wav_path' in manifest_df.columns
    wav_paths, texts = list(manifest_df['wav_path'].values), list(manifest_df['text'].values)
    # not using multiprocessing for simplicity
    txt_paths = [save_txt_file(*_) for _ in tqdm(zip(wav_paths, texts), total=len(wav_paths))]
    manifest_df['text_path'] = txt_paths
    return manifest_df


def replace_encoded(text):
    text = text.lower()
    if '2' in text:
        text = list(text)
        _text = []
        for i,char in enumerate(text):
            if char=='2':
                try:
                    _text.extend([_text[-1]])
                except:
                    print(''.join(text))
            else:
                _text.extend([char])
        text = ''.join(_text)
    return text
```

```python
# reading opus files
import os
import soundfile as sf



# Fx for soundfile read/write functions
def fx_seek(self, frames, whence=os.SEEK_SET):
    self._check_if_closed()
    position = sf._snd.sf_seek(self._file, frames, whence)
    return position


def fx_get_format_from_filename(file, mode):
    format = ''
    file = getattr(file, 'name', file)
    try:
        format = os.path.splitext(file)[-1][1:]
        format = format.decode('utf-8', 'replace')
    except Exception:
        pass
    if format == 'opus':
        return 'OGG'
    if format.upper() not in sf._formats and 'r' not in mode:
        raise TypeError("No format specified and unable to get format from "
                        "file extension: {0!r}".format(file))
    return format


#sf._snd = sf._ffi.dlopen('/usr/local/lib/libsndfile/build/libsndfile.so.1.0.29')
sf._subtypes['OPUS'] = 0x0064
sf.SoundFile.seek = fx_seek
sf._get_format_from_filename = fx_get_format_from_filename


def read(file, **kwargs):
    return sf.read(file, **kwargs)


def write(file, data, samplerate, **kwargs):
    return sf.write(file, data, samplerate, **kwargs)
```

```python
# display utils
import gc
from IPython.display import HTML, Audio, display_html
pd.set_option('display.max_colwidth', 3000)
#Prepend_path is set to read directly from Azure. To read from local replace below string with path to the downloaded dataset files
prepend_path = 'https://azureopendatastorage.blob.core.windows.net/openstt/ru_open_stt_opus_unpacked/'


def audio_player(audio_path):
    return '<audio preload="none" controls="controls"><source src="{}" type="audio/wav"></audio>'.format(audio_path)

def display_manifest(manifest_df):
    display_df = manifest_df
    display_df['wav'] = [audio_player(prepend_path+path) for path in display_df.wav_path]
    display_df['txt'] = [read_txt_file(prepend_path+path) for path in tqdm(display_df.text_path)]
    audio_style = '<style>audio {height:44px;border:0;padding:0 20px 0px;margin:-10px -20px -20px;}</style>'
    display_df = display_df[['wav','txt', 'duration']]
    display(HTML(audio_style + display_df.to_html(escape=False)))
    del display_df
    gc.collect()
```

## Play with a dataset

### Play a sample of files

Most platforms browsers support native audio playback. So we can use HTML5 audio players to view our data.

```python
manifest_df = read_manifest(prepend_path +'/manifests/public_series_1.csv')
#manifest_df = reroot_manifest(manifest_df,
                              #source_path='',
                              #target_path='../../../../../nvme/stt/data/ru_open_stt/')

```

```python
sample = manifest_df.sample(n=20)
display_manifest(sample)
```

### Read a file

```python
!ls ru_open_stt_opus/manifests/*.csv
```

Some examples showing how to best read wav and opus files.

Scipy is the fastest for wav. Pysoundfile is the best overall for opus.

```python
%matplotlib inline

import librosa
from scipy.io import wavfile
from librosa import display as ldisplay
from matplotlib import pyplot as plt
```

#### Read a wav

```python
manifest_df = read_manifest(prepend_path +'manifests/asr_calls_2_val.csv')
#manifest_df = reroot_manifest(manifest_df,
                              #source_path='',
                              #target_path='../../../../../nvme/stt/data/ru_open_stt/')
```

```python
sample = manifest_df.sample(n=5)
display_manifest(sample)
```

```python
from io import BytesIO

wav_path = sample.iloc[0].wav_path
response = urlopen(prepend_path+wav_path)
data = response.read()
sr, wav = wavfile.read(BytesIO(data))
wav.astype('float32')
absmax = np.max(np.abs(wav))
wav =  wav / absmax
```

```python
# shortest way to plot a spectrogram
D = librosa.amplitude_to_db(np.abs(librosa.stft(wav)), ref=np.max)
plt.figure(figsize=(12, 6))
ldisplay.specshow(D, y_axis='log')
plt.colorbar(format='%+2.0f dB')
plt.title('Log-frequency power spectrogram')
# shortest way to plot an envelope
plt.figure(figsize=(12, 6))
ldisplay.waveplot(wav, sr=sr, max_points=50000.0, x_axis='time', offset=0.0, max_sr=1000, ax=None)
```

#### Read opus

```python
manifest_df = read_manifest(prepend_path +'manifests/asr_public_phone_calls_2.csv')
#manifest_df = reroot_manifest(manifest_df,
                              #source_path='',
                              #target_path='../../../../../nvme/stt/data/ru_open_stt/')
```

```python
sample = manifest_df.sample(n=5)
display_manifest(sample)
```

```python
opus_path = sample.iloc[0].wav_path
response = urlopen(prepend_path+opus_path)
data = response.read()
wav, sr = sf.read(BytesIO(data))
wav.astype('float32')
absmax = np.max(np.abs(wav))
wav =  wav / absmax
```

```python
# shortest way to plot a spectrogram
D = librosa.amplitude_to_db(np.abs(librosa.stft(wav)), ref=np.max)
plt.figure(figsize=(12, 6))
ldisplay.specshow(D, y_axis='log')
plt.colorbar(format='%+2.0f dB')
plt.title('Log-frequency power spectrogram')
# shortest way to plot an envelope
plt.figure(figsize=(12, 6))
ldisplay.waveplot(wav, sr=sr, max_points=50000.0, x_axis='time', offset=0.0, max_sr=1000, ax=None)
```

<!-- nbend -->

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).

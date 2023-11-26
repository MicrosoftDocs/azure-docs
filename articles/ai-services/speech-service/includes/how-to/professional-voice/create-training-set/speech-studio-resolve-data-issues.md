---
 title: include file
 description: include file
 author: eur
 ms.author: eric-urban
 ms.service: azure-ai-services
 ms.topic: include
 ms.date: 11/24/2023
 ms.custom: include
---

After upload, you can check the data details of the training set. Before continuing to [train your voice model](../../../../professional-voice-train-voice.md), you should try to resolve any data issues.

You can identify and resolve data issues per utterance in [Speech Studio](https://aka.ms/custom-voice-portal). 

1. On the detail page, go to the **Accepted data** or **Rejected data** page. Select individual utterances you want to change, then select **Edit**.

   :::image type="content" source="../../../../media/custom-voice/cnv-edit-trainingset.png" alt-text="Screenshot of selecting edit button on the accepted data or rejected data details page.":::

   You can choose which data issues to be displayed based on your criteria.
   
    :::image type="content" source="../../../../media/custom-voice/cnv-issues-display-criteria.png" alt-text="Screenshot of choosing which data issues to be displayed":::

1. Edit window will be displayed.

   :::image type="content" source="../../../../media/custom-voice/cnv-edit-trainingset-editscript.png" alt-text="Screenshot of displaying Edit transcript and recording file window.":::

1. Update transcript or recording file according to issue description on the edit window.

   You can edit transcript in the text box, then select **Done**

   :::image type="content" source="../../../../media/custom-voice/cnv-edit-trainingset-scriptedit-done.png" alt-text="Screenshot of selecting Done button on the Edit transcript and recording file window.":::

   If you need to update recording file, select **Update recording file**, then upload the fixed recording file (.wav).
 
   :::image type="content" source="../../../../media/custom-voice/cnv-edit-trainingset-upload-recording.png" alt-text="Screenshot that shows how to upload recording file on the Edit transcript and recording file window.":::

1. After you've made changes to your data, you need to check the data quality by clicking **Analyze data** before using this dataset for training.

   You can't select this training set for training model before the analysis is complete. 

   :::image type="content" source="../../../../media/custom-voice/cnv-edit-trainingset-analyze.png" alt-text="Screenshot of selecting Analyze data on Data details page.":::

   You can also delete utterances with issues by selecting them and clicking **Delete**.

### Typical data issues

The issues are divided into three types. Refer to the following tables to check the respective types of errors. 

**Auto-rejected**

Data with these errors won't be used for training. Imported data with errors will be ignored, so you don't need to delete them. You can [fix these data errors online](#resolve-data-issues-online) or upload the corrected data again for training.  

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Script | Invalid separator| You must separate the utterance ID and the script content with a Tab character.|
| Script | Invalid script ID| The script line ID must be numeric.|
| Script | Duplicated script|Each line of the script content must be unique. The line is duplicated with {}.|
| Script | Script too long| The script must be less than 1,000 characters.|
| Script | No matching audio| The ID of each utterance (each line of the script file) must match the audio ID.|
| Script | No valid script| No valid script is found in this dataset. Fix the script lines that appear in the detailed issue list.|
| Audio | No matching script| No audio files match the script ID. The name of the .wav files must match with the IDs in the script file.|
| Audio | Invalid audio format| The audio format of the .wav files is invalid. Check the .wav file format by using an audio tool like [SoX](http://sox.sourceforge.net/).|
| Audio | Low sampling rate| The sampling rate of the .wav files can't be lower than 16 KHz.|
| Audio | Too long audio| Audio duration is longer than 30 seconds. Split the long audio into multiple files. It's a good idea to make utterances shorter than 15 seconds.|
| Audio | No valid audio| No valid audio is found in this dataset. Check your audio data and upload again.|
| Mismatch | Low scored utterance| Sentence-level pronunciation score is lower than 70. Review the script and the audio content to make sure they match.|

**Auto-fixed**

The following errors are fixed automatically, but you should review and confirm the fixes are made correctly.

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Mismatch |Silence auto fixed |The start silence is detected to be shorter than 100 ms, and has been extended to 100 ms automatically. Download the normalized dataset and review it. |
| Mismatch |Silence auto fixed | The end silence is detected to be shorter than 100 ms, and has been extended to 100 ms automatically. Download the normalized dataset and review it.|
| Script | Text auto normalized|Text is automatically normalized for digits, symbols, and abbreviations. Review the script and audio to make sure they match.|

**Manual check required**

Unresolved errors listed in the next table affect the quality of training, but data with these errors won't be excluded during training. For higher-quality training, it's a good idea to fix these errors manually. 

| Category | Name | Description |
| --------- | ----------- | --------------------------- |
| Script | Non-normalized text |This script contains symbols. Normalize the symbols to match the audio. For example, normalize */* to *slash*.|
| Script | Not enough question utterances| At least 10 percent of the total utterances should be question sentences. This helps the voice model properly express a questioning tone.|
| Script | Not enough exclamation utterances| At least 10 percent of the total utterances should be exclamation sentences. This helps the voice model properly express an excited tone.|
| Script | No valid end punctuation| Add one of the following at the end of the line: full stop (half-width '.' or full-width '。'), exclamation point (half-width '!' or full-width '！' ), or question mark ( half-width '?' or full-width '？').|
| Audio| Low sampling rate for neural voice | It's recommended that the sampling rate of your .wav files should be 24 KHz or higher for creating neural voices. If it's lower, it will be automatically raised to 24 KHz.|
| Volume |Overall volume too low|Volume shouldn't be lower than -18 dB (10 percent of max volume). Control the volume average level within proper range during the sample recording or data preparation.|
| Volume | Volume overflow| Overflowing volume is detected at {}s. Adjust the recording equipment to avoid the volume overflow at its peak value.|
| Volume | Start silence issue | The first 100 ms of silence isn't clean. Reduce the recording noise floor level, and leave the first 100 ms at the start silent.|
| Volume| End silence issue| The last 100 ms of silence isn't clean. Reduce the recording noise floor level, and leave the last 100 ms at the end silent.|
| Mismatch | Low scored words|Review the script and the audio content to make sure they match, and control the noise floor level. Reduce the length of long silence, or split the audio into multiple utterances if it's too long.|
| Mismatch | Start silence issue |Extra audio was heard before the first word. Review the script and the audio content to make sure they match, control the noise floor level, and make the first 100 ms silent.|
| Mismatch | End silence issue| Extra audio was heard after the last word. Review the script and the audio content to make sure they match, control the noise floor level, and make the last 100 ms silent.|
| Mismatch | Low signal-noise ratio | Audio SNR level is lower than 20 dB. At least 35 dB is recommended.|
| Mismatch | No score available |Failed to recognize speech content in this audio. Check the audio and the script content to make sure the audio is valid, and matches the script.|

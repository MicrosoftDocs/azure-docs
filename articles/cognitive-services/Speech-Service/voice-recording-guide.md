---
title: How to record voice samples for creating a custom voice | Microsoft Docs
description: Here are answers to the most popular questions about the Speech to Text.
services: cognitive-services
author: v-jerkin
manager: noellelacharite
ms.service: cognitive-services
ms.component: speech-service
ms.topic: article
ms.date: 07/5/2018
ms.author: v-jerkin
---

# How to record voice samples for a custom voice

Creating a high-quality production custom voice from scratch is not a casual undertaking. The central component of a custom voice is a large collection of audio samples of human speech. It's vital that these audio recordings be of high quality. Choose voice talent that has experience making these kinds of recordings, and have them recorded by a competent recording engineer using professional equipment.

Before you can make the recordings, though, you need a script: the words that will be read by your voice talent to create the audio samples. For best results, your script must have good phonetic coverage and sufficient variety to train the custom voice model.

Many ingredients go into a good custom voice. This guide serves as an introduction to the process, with particular attention paid to issues you are likely to encounter.

> [!TIP]
> For the highest quality results, consider engaging Microsoft to help develop your custom voice. Microsoft has extensive experience producing high-quality voices for its own products, including Cortana and Office.

## Voice recording roles

There are four basic roles in a voice recording project for custom voices.

Role|Purpose
-|-
Voice talent        |The person whose voice will form the basis of the custom voice.
Recording engineer  |The person who oversees the technical aspects of the recording and operates the recording equipment.
Director            |Prepares the script and coaches the voice talent's performance.
Editor              |Finalizes the audio files and prepares them for upload to the Custom Voice portal.

One person may fill more than one role. This guide assumes that you will be primarily filling the director role, and hiring voice talent and a recording engineer. There is, however, some information about the recording engineer role in case you want to make the recordings yourself.

## Choosing voice talent

Actors with experience in voiceover or voice character work make good custom voice talent. You can also often find suitable talent among announcers and newsreaders. Choose voice talent whose natural voice you like. Asking the talent to "do a voice" can cause voice strain that can make it hard to make consistent recordings.

> [!TIP]
> Generally, avoid using recognizable voices to create a custom voice—unless, of course, your goal is to produce a celebrity voice. Lesser-known voices are usually less distracting to users.

The most important single factor in choosing voice talent is consistency. Ideally, all your recordings should sound like they were made on the same day in the same room. You can partly reach this ideal through good recording practices and engineering. However, your voice talent must be able to speak with consistent rate, volume level, pitch, and tone. Clear diction is a must. Your talent also needs to be able to strictly control his or her pitch variation, emotional affect, and speech mannerisms.

Recording samples for a custom voice can be more fatiguing than other kinds of voice work. Most voice talent can record for two or three hours a day. Limit sessions to three or four a week, with a day off in between if possible.

Recordings made for a voice model should be emotionally neutral. That is, a sad utterance should not be read in a sad way. This allows mood to be easily added to the synthesized speech later. Work with your voice talent to develop a "character" that defines the overall sound and emotional tone of the custom voice. This process will pinpoint what "neutral" sounds like for that character.

A person may have, for example, an upbeat personality. So the character's voice may carry a note of optimism even when speaking neutrally. However, any such personality trait should be subtle an consistent. Listen to some existing TTS voices to get an idea of what you're looking for.

### Legalities

Usually, you'll want to own the voice recordings you make. Your voice talent should therefore be amenable to a work-for-hire contract for the project.

## Creating a script

The starting point of any custom voice is the script, which contains the utterances to be recorded by your voice talent.

> [!NOTE]
> The term "utterances" is used because they may or may not be full sentences. Phrases are fine.

The utterances in your script can come from anywhere: fiction, non-fiction, transcripts of speeches, news reports, and anything else available in printed form. If you want to make sure your voice does well on specific kinds of words (such as medical terminology or programming jargon), you may want to include sentences from scholarly papers or technical documents. (However, see [Legalities](#legalities) below.) You can also write your own text.

The utterances don't need come from the same source, or the same kind of source. They don't even need to have anything to do with each other. However, if you will use set phrases (for example, "You have successfully logged in") in your speech application, make sure to include them in your script. This wil give your custom voice a better chance of doing well. As a bonus, if you later decide to use the recording in place of synthesized speech, you'll have it available.

While consistency is key in choosing voice talent, variety is the hallmark of a good script. Your script should include many different words and sentences with a variety of sentence lengths, structures, and moods. Every sound in the language should be represented multiple times and in numerous contexts (called *phonetic coverage).* 

Furthermore, the text should incorporate all the ways that a particular sound can be represented in writing, and place these sounds at varying places in the sentences. Both declarative sentences and questions should be included, and read with appropriate intonation.

It's difficult to write a script that provides *just enough* data to allow the Custom Speech portal to build a great voice. In practice, the simplest way to make a script that achieves full phonetic coverage is to "make it up in volume." Microsoft's standard voices were built from tens of thousands of utterances. You should be prepared to record a few to several thousand utterances to build a production-quality custom voice.

Check the script carefully for errors. If possible, have someone else check it too. WMhen you run through the script with your talent, you'll probably catch a few more.

### Script format

A basic script format has three columns, which you can easily set up using Microsoft Word.

* The number of the utterance, starting at 1. Numbering will make it easy for everyone in the studio to refer to a particular utterance ("let's try number 56 again").
* A blank column where you'll write in the time code of each utterance: the time at which you'll find it in the recorded audio file.
* The text of the utterance itself.

![Sample script](media/custom-voice/script.png)

Leave enough space after each row to write notes. Be sure that no utterance is split between pages. Number the pages and print your script on one side of the paper.

Print three copies of the script: one for the talent, one for the engineer, and one for the director (you). Don't staple the pages together: an experienced voice artist will take them out before recording to avoid making noise as the pages are turned.

### Legalities

Under copyright law, n actor's reading of a copyrighted work is a performance for which the author of the work may need to be compensated. This performance will not be recognizable in the custom voice. Even so, the legality of using a copyrighted work for this purpose is not well-established. Microsoft cannot provide legal advice on this issue; consult your own counsel.

Fortunately, it is easy to avoid these issues. There are many sources of text you can use without potential legal issues.

|||
|-|-|
|[CMU Arctic corpus](http://festvox.org/cmu_arctic/)|About 1100 sentences selected from out-of-copyright works specifically for use in speech synthesis projects. An excellent starting point.|
|Works with<br>expired copyright|Typically works published prior to 1923. For English, Project Gutenberg offers tens of thousands of such works. You may want to focus on newer works, as the language will be closer to modern English.|
|Government&nbsp;works|Works created by the United States government are not copyrighted in the United States, though the government may claim copyright in other countries.|
|Public domain|Works for which copyright has been explicitly disclaimed or that have been dedicated to the public domain.|
|Permissively-licensed works|Works distributed under a license such as Creative Commons or the GNU Free Documentation License. Wikipedia uses the GFDL. Some licenses, however, may impose restrictions on performance of the licensed content that may impact the creation of a custom voice model, so read the license carefully.|

## Recording your script

If possible, record your script at a professional recording studio that specializes in voiceover work. They'll have a recording booth, the right equipment for the job, and the right people to operate it. It pays not to skimp on recording.

Discuss your project with the studio's recording engineer and listen to his or her advice. The recording should have little or no dynamic range compression (maximum of 4:1). It is critical that the audio have consistent volume and a high signal-to-noise ratio, while being free of unwanted sounds.

### Doing it yourself

If you want to try doing the recording yourself, here are some tips.

* Your "recording booth" should be a small room with no noticeable echo or "room tone" and which is as quiet and soundproof as possible. Drapes on the walls can be used to reduce echo and neutralize or "deaden" the sound of the room.

* Use a high-quality studio condenser microphone. (Neumann, Sennheiser, and AKG are good brands.) You can rent one from a local audio-visual rental firm. You will also need a pre-amp. Professional gear has balanced XLR connectors rather than the 1/4" connectors found on consumer equipment.

* Install the microphone on a stand and use a pop filter on the microphone to eliminate noise from "plosive" sounds like "p" and "b." 

* The voice talent must always be the same distance from the microphone. Use tape on the floor to mark where they should stand. If the talent prefers to sit, take special care. Sitting may complicate maintaining a constant distance from the mic, and adds a new source of unwanted sounds to watch out for (the chair).

* Use a stand to hold the script; avoid angling the stand so that it can reflect sound toward the microphone.

* The person actually doing the recording—the engineer—should be in a separate room from the talent, with some way to talk to the talent in the recording booth.

* The recording should contain as little noise as possible, with a goal of an 80 db signal-to-noise ratio or better.

    Listen closely to a recording of silence, figure out where any noise is coming from, and eliminate the cause. Common sources of noise are air ducts, fluorescent light ballasts, traffic on nearby roads, and equipment fans (eves notebook PCs may have fans). Microphones can pick up electrical noise from AC wiring. 

    > [!TIP]
    > In some cases, you may be able to use an equalizer or noise reduction software plug-in to help remove noise from your recordings, though it is always best to stop it at its source.


* Levels should be set so that most of the available dynamic range of digital recording is used without overdriving into distortion. That means loud, but not so loud that the audio distorts. Below is an example of the waveform of a good recording.

    ![good recording waveform](media/custom-voice/good-recording.png)

    You can see that most of the range (height) is used, but the highest peaks of the signal do not reach the top of the window. You can also see that the silence in the recording is very close to being a horizontal line, indicating a low noise floor. This recording has acceptable dynamic range and signal-to-noise ratio.

* Record directly into the computer using a high-quality audio interface with balanced XLR connectors. Keep the audio chain simple: mic, preamp, audio interface, computer. Use Pro Tools if you have it available; if you're on a budget, try the free [Audacity](https://www.audacityteam.org/).

* Record at 44.1 KHz 16 bit monophonic (CD quality). You'll have to downsample your audio to 16 KHz before you submit it to the Custom Voice portal. But it it pays to have a high-quality original recording in case edits are needed.

* Ideally, have different people serve in the roles of director, engineer, and talent. Don't try to do it all yourself! In a pinch, the director and engineer could be a single person.

### Before the session

To avoid wasting studio time, run through the script with your voice talent before the session. The voice talent gains familiarity with the text, and has an opportunity to clarify the pronunciation of any unfamiliar words.

> [!NOTE]
> Many recording studios offer electronic display of scripts in the recording booth. In this case, take notes from your run-through directly into the script's document. You'll still want a paper copy to take notes on, though. So will the engineer. And you'll still want a third printed copy as a backup in case the copmuter is down!

Your voice talent may ask which word you want emphasized in each utterance. Knowing the "operative word" is important to an actor's performance. But in this case, you want a neutral reading with no particular word emphasized. Emphasis is added when new speech is synthesized; it is not a part of the original audio recordings.

Direct the talent to pronounce words distinctly. Every word of the script should be pronounced as written. Sounds should not be omitted or slurred together, as is common in casual speech.

|Written text|Unwanted pronunciation|
|-|-|
|never going to give you up|never gonna give you up|
|there are four lights|there're four lights|
|how's the weather today|how's th' weather today|

Talent should *not* insert distinct pauses between words. The sentence should still flow naturally. This fine distinction may take some practice to get right.

### The recording session

Create a reference recording early in the session of a typical utterance and play it back to the voice talent regularly to help them keep their performance consistent. The engineer can use it as a reference for levels and overall consistency of sound. This is especially important when resuming work after a break, or on another day.

Coach your talent to take a deep breath and pause before each utterance. Record a couple of seconds of silence between utterances.

Record a good five seconds of silence before the first recording to capture the "room tone." This helps the Custom Voice portal compensate for any remaining noise in the recordings.

> [!TIP]
> All you really need is the voice talent's work, so you can record only one channel. However, if you record in stereo, the second channel can be used to record the conversation in the control room so you can refer to it later. You would then remove this track from the version uploaded to the Custom Voice portal.

Listen closely, using headphones, to the voice talent's performance. You're looking for good but natural diction, correct pronunciation, and a lack of unwanted sounds. Don't hesitate to ask your talent to re-record an utterance that doesn't meet these standards. Pacing should be consistent; a metronome played through the talent's headphones may be helpful if they're having trouble. Words should be pronounced the same way each time they appear.

> [!TIP] 
> If you are recording a high volume of utterances, losing a single utterance may not affect the resulting voice in any way you'd notice. So it may be more expedient to simply note any utterances that have problems, exclude them from your data set, and see how your voice turns out. You can always come back to the studio and record missed utterances later.

Most studios have a large "time code" display indicating the current time in the recording. Take a note of the time on your script for each utterance. Ask the engineer if they can mark each utterance in the recording's metadata.

Take regular breaks to let the voice talent keep his or her voice in good shape. Provide them with something to drink to keep their throat from getting dry.

### After the session

Modern recording studios record digitally, so you'll receive one or more audio files. These files will probably be WAV or AIFF format in CD quality (44.1 KHz 16-bit) mono or stereo. You may be offered even higher-quality recordings, such as 96 KHz 24-bit, but CD quality is sufficient.

The studio probably delivered one audio file per session. To upload the recordings to the Custom Voice portal, each utterance must be in a separate file. The recording engineer may have placed a marker in the file (or provided a separate *cue list)* to indicate where each utterance starts. This metadata can be used to extract each utterance.

You'll need to go through the full recording and make a WAV file for each utterance. Use your notes to find the exact utterances you want, then use a sound editing utility such as [Audacity](https://www.audacityteam.org/) to copy each into a new file. Leave only about 0.2 seconds of silence at the beginning and end of each clip except for the first. That file should have a full five seconds. Do not use the audio editor to "zero out" silent parts of the file.

Listen to each file. At this stage, you can edit out small unwanted sounds that you missed during recording—as long as it does not overlap any actual speech. If you can't fix a particular file, remove it from your data set entirely.

Downsample each file to 16 KHz before saving and, if you recorded in stereo, remove the second channel. Save each file in WAV format.

Archive the original recording in a safe place in case you need to go back to it later. Save your notes in a safe place, too.

### Next steps

Use your recordings to create your custom voice.

> [!div class="nextstepaction"]
> [Creating custom voice fonts](how-to-customize-voice-font.md)

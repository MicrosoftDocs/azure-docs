

# Custom voice recording guide

Creating a high-quality production custom voice from scratch is no casual undertaking. The central component of a custom voice is the audio samples from a human speaker. It's vital that these audio recordings be consistent and of high quality. You'll want voice talent that has experience making these kinds of recordings, and record them using professional equipment and a competent recording engineer.

Before you can make the recordings, though, you need a script: the words that will be read by your voice talent to create the audio samples. For best results, your script must have good phonetic coverage and sufficient variety to train the custom voice model.

Many different factors go into a good custom voice. This guide serves as an introduction to and overview of the process, with special attention given to issues you are likely to encounter.

> [!TIP]
> For the absolute best results, consider engaging Microsoft to help develop your custom voice. We have extensive experience, having produced high-quality voices for our own products, including Cortana and Office.

## Voice recording roles

There are four roles in a voice recording project for custom voices. In small projects, one person may fill multiple roles. These roles are:

* Voice talent: The person whose voice will form the basis of the custom voice.
* Recording engineer: The person who oversees the technical aspects of the recording and operates the recording equipment.
* Director: Prepares the script and coaches the voice talent on his or her performance.
* Editor: Finalizes the audio files and prepares them for upload to the Custom Voice portal.

This guide is written assuming that the reader will be primarily filling the director roles, although there is also some information on the recording engineer and editor roles.

## Choosing voice talent

The best voice talent for creating a custom voice model is typically an actor with experience in voiceover or voice character work (for example, in animation). You can also often find suitable talent among announcers and newsreaders. Choose voice talent whose natural voice you like; don't ask him or her to "do a voice," as this causes voice strain that can make it hard to make consistent recordings.

> [!TIP]
> Generally, avoid using recognizable voices to create a custom voice—unless, of course, your goal is to produce a celebrity voice. Lesser-known voices are less distracting to users.

The most important single factor in choosing voice talent is consistency. Ideally, all recordings should sound like they were made on the same day in the same room. This ideal can be partly reached through good recording practices and engineering. However, your voice talent must be able to speak at a consistent rate, volume level, pitch, and tone. Clear diction is a must. Your talent also needs the ability to strictly control his or her pitch variation, emotional affect, and speech mannerisms.

Recordings made for a voice model should be emotionally neutral. An sad utterance should not be read in a sad way. The recordings will be broken down into individual speech sounds (phonemes) and used to synthesize new utterances. These new utterances may have an emotional context completely different from the original. Only if the recording is emotionally neutral can new emotion can be injected at synthesis time.

Work with your voice talent to develop the overall sound and emotional tone of the custom voice, defining exactly what "neutral" sounds like for that character. A person may have, for example, an upbeat personality, and his or her voice may carry an inherent note of optimism. However, keep it subtle and, of course, consistent.

### Legalities

Usually, you'll want the voice recordings to be your property. Your voice talent therefore needs to be amenable to a work-for-hire contract for the project.

## Creating a script

The starting point of any custom voice is the script, which contains the utterances to be recorded by your voice talent. 

Utterances can come from virtually anywhere: fiction, non-fiction, transcripts of speeches, news reports, and anything else that comes in printed form. If you want to make sure your voice does well on specific kinds of words (such as medical terminology or programming jargon), you may want to incorporate scholarly papers or technical documents. (However, see [Avoiding rights issues](#avoiding-rights-issues) below.) You can also write your own text.

It is not necessary that all the utterances come from the same source, or even the same kind of source. However, if you will use set phrases (for example, "You have successfully logged in"), make sure these are included. This will help your custom voice perform well on these phrases, and if you want use the original audio files in place of synthesized speech, you'll have them handy.

While consistency is key in choosing voice talent, variety is the hallmark of a good script. Your script should include many different words of various derivations and sentences with a variety of sentence lengths, structures, and moods. Every sound in the language should be represented (referred to as *phonetic coverage).* Furthermore, the text should incorporate all the ways that a given sound can be represented in writing, and place the various sounds at varying places in the sentence. Both declarative sentences and questions should be included.

It's time-consuming to build a script that provides everything the machine learning algorithm needs to build a great custom voice. In practice, *volume* is the simplest way to make a script that achieves these goals. Microsoft's standard voices were built from tens of thousands of utterances. You should be prepared to record a few to several thousand utterances to build a production-quality custom voice.

Check the script carefully for errors. If possible, have someone else check it.

### Script format

A basic script format has three columns, which you can easily set up using Microsoft word.

* The number of the utterance, starting at 1.
* A blank column where you'll write in the time code of each utterance (that is, the time at which you'll find it in the recorded audio file).
* The utterance itself.

TBD: Screen shot here

Leave enough space after each row for you and the voice talent to write short notes. Be sure that no utterance is split between pages if it spans multiple lines. Number the pages and print your script on one side of the paper, not duplex, to avoid having to flip the pages during the recording session.

### Legalities

An actor's reading of a copyrighted work constitutes a performance for which the author of the work may need to be compensated. A performance created for the purpose of creating a custom voice will be unrecognizable in the final result of the process. Even so, the legality of using a copyrighted work for this purpose is currently unsettled in most jurisdictions. Microsoft cannot provide legal advice on this issue; consult your own counsel.

Fortunately, it is easy to sidestep rights issues with your script. There are many sources of text you can use without potential legal issues, such as the ones listed below.

|||
|-|-|
|CMU Arctic corpus|About 1100 sentences selected from out-of-copyright works specifically for use in speech synthesis projects. An excellent starting point.|
|Works with<br>expired copyright|Typically works published prior to 1923. For English, Project Gutenberg offers tens of thousands of such works. You may want to focus on newer works, as the language will be closer to what we use today.|
|Government&nbsp;works|Works created by the United States government are uncopyrighted in the United States, though the government may claim copyright in other countries.|
|Public domain|Works for which copyright has been explicitly disclaimed or that have been dedicated to the public domain.|
|Permissively-licensed works|Works distributed under a license such as Creative Commons or the GNU Free Documentation License. (Wikipedia uses the GFDL.) Some licenses, however, may impose restrictions on performance of the licensed content that may impact the creation of a custom voice model, so read the license carfully.|

## Recording your script

If at all possible, record your script at a professional recording studio that specializes in voiceover work. They'll have a separate recording booth, the right equipment for the job, and the right people to operate it. It pays not to skimp on this.

Discuss your project with the studio's recording engineer and listen to his or her recommendations. The engineer needs to know to use little to no dynamic range compression (no more than 4:1). He or she may choose to use an equalizer to help reduce sounds outside the range of human speech. It is critical that the audio be consistent in volume, with a high signal-to-noise ratio and free of mouth noises and other extraneous sounds.

### Doing it yourself

If you want to try it yourself, here are some tips.

* Your recording booth should be a small room with no noticeable echo or "room tone" and which is as soundproof as possible. Curtains on the walls can be used to minimize the sound of the room. 

* Use a high quality studio microphone. (Neumann, Sennheiser, and AKG are good brands.) You should be able to rent a microphone from a local audio-visual rental. You will also need a mic pre-amp. These will have professional XLR connectors rather than the 1/4" connectors found on consumer gear.

* Install the microphone on a stand and use a "pop filter" on the microphone to eliminate noise from "plosive" sounds like "p" and "b." 

* The voice talent must always be the same distance from the microphone. Use tape on the floor to mark where they should stand. (Usually, the talent will stand, but they may sit if they prefer, although this will complicate somewhat maintaining a contstant distance from the mic.)

* Use a stand to hold the script; avoid angling the stand so that it can reflect sound to the microphone.

* The person actually doing the recording—the engineer—should be in a separate room from the talent, with some way to talk to the talent in the recording booth.

* The recording should contain as little noise as possible, with a goal of at least an 80 db signal-to-noise ratio. (This is where a real studio shines.) Listen closely to a recording of silence, figure out where any noise is coming from, and eliminate the cause. In some cases you may be able to use an equalizer or noise reduction software plug-in to help manage noise, though it is always best to stop it at its source.

* Levels should be set so that most of the available dynamic range of digital recording is used without overdriving into distortion.

* Record directly into the computer using a high-quality audio interface with professional XLR connectors. Keep the audio chain simple: mic, preamp, computer. Use Pro Tools if you have it available; if you're on a budget, try the free Audacity.

* Record at 44.1 KHz 16 bit monophonic (CD quality). You'll have to downsample your audio to 16 KHz before you can submit it to the Custom Voice portal, but it pays to have a highest-quality original recording in case edits are needed.

* Ideally, have different people serve the role of director, engineer, and talent. Don't try to do it all yourself! In a pinch, director and engineer could be combined.

### Before the session

Print three copies of the script: one for the talent, one for the engineer, and one for the director (you). Don't staple the pages together: an experienced voice artist will take them out before recording anyway to avoid making noise as the pages are turned.

To avoid wasting studio time, run through the script with your voice talent before the session. This gives the talent some familiarity with the text, and offers them an opportunity to clarify the pronunciation of any unfamiliar words.

> [!NOTE]
> Many recording studios offer electronic display of scripts in the recording booth. In this case, take notes from your run-through directly into the script's document. You'll still want a paper copy to take notes on, though, as may the engineer. And you'll still want a third printed copy as a backup in case the copmuter is down!

Your voice talent may ask how you want a sentence to be read: whether to emphasize one word or another. Knowing the "operative word" is vital to an actor's performance, but in this case, you want a completely neutral reading with no particular word emphasized. Remember that emphasis is added when new speech is synthesized; it is not a part of the audio recordings.

Be sure that the talent knows to pronounce words distinctly. Every word of the script should be pronounced as written. For example:

|Written text|Unwanted pronunciation|
|-|-|
|never going to give you up|never gonna give you up|
|there are four lights|there're four lights|
|how's the air up there|how's th' air up there|

However, talent should *not* pause between words, but rather let the sentence flow naturally. It's a fine line that you as the director must monitor closely.

### The recording session

Create a reference recording early in the session of a typical utterance and play it back to the voice talent to help them keep their performance consistent. The engineer can use it as a reference for levels. This is especially important when resuming work after a break, or the next day.

Coach your talent to take a deep breath and pause before each utterance. Record each utterance with a couple of seconds of silence before and after. 

Leave a good five seconds of silence before the first recording to capture the "room tone." You'll upload this as part of that first file to help the Custom Voice portal compensate for any remaining noise in the recordings.

Listen closely, using headphones, to the voice talent's performance. You're listening for good but natural diction, correct pronunciation, and a lack of noise (human and otherwise). Don't hesitate to ask your talent to re-record any utterance that doesn't meet your standards. Pacing should be consistent and words should be pronounced the same way each time they appear.

> [!TIP] If you have a lot of utterances, losing a single utterance may not affect the resulting voice in any way you'd notice. So it may be more expedient to simply note any utterances with errors, exclude them from your data set, and see how your voice turns out. You can always record the missed utterances later.

The studio will have a large timecode display indicating the current time in the recording. Take a note of the time on your script for each utterance, or ask the engineer if they can mark each utterance in the metadata for the actual recording.

> [!TIP]
> Recording samples for a custom voice is more fatiguing than some other kinds of voice work. Take regular breaks to let the voice talent keep his or her voice in good shape.  Most voice talent can record for 2-3 hours a day, though some can do 4. Limit sessions to 3-4 a week depending on length.

### After the session

Modern recording studios record digitally, so in the end you'll receive a computer file, WAV or AIFF format, in CD quality (44.1 KHz 16-bit) monophonic. The recording engineer may have placed a virtual marker in the file (or provide a separate cue file) to indicate the start of each utterance. This can be used to locate each utterance and extract it to a separate file, as required by the Custom Voice portal.

The recording engineer may be able to automate the process of splitting each utterance into a separate file. Otherwise, you'll need to go through the recording and make a separate WAV file for each utterance. Use your notes to find the exact utterances you want, then use a sound editing utility such as [Audacity](https://www.audacityteam.org/) to cut these into new files. Leave only about 0.2 second of silence at the beginning and end of each file except for the first. Do not use the audio editor to "zero out" the silent parts of the file. 

Check each file to make sure it's good. At this stage, you could edit out small unwanted sounds that you missed during recording. Remove any files that you can't fix.

Change the bitrate of each file to 16 KHz before saving.

### Next steps

Create your custom voice


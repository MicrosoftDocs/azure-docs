const {createHash} = require('node:crypto');

const PREFIX = '<!-- kp-business-clock:v1\n';
const BOT = 'github-actions[bot]';
const HOUR = 3600000;
const weekday = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', weekday: 'short'
});

function isDue(activityAt, now, days) {
  let remaining = days * 24 * HOUR;
  let cursor = Date.parse(activityAt);
  if (!Number.isFinite(cursor) || !Number.isFinite(now) ||
      !Number.isInteger(days) || days < 0) throw new Error('Invalid business clock settings');
  // Los Angeles weekday boundaries and DST transitions fall on UTC hour boundaries.
  while (cursor < now && remaining > 0) {
    const next = Math.min(now, (Math.floor(cursor / HOUR) + 1) * HOUR);
    if (!['Sat', 'Sun'].includes(weekday.format(cursor))) remaining -= next - cursor;
    cursor = next;
  }
  return remaining <= 0;
}

function fingerprint(pr, managedLabels) {
  return createHash('sha256').update(JSON.stringify({
    title: pr.title, body: pr.body, head: pr.head.sha, base: pr.base.ref,
    draft: pr.draft, milestone: pr.milestone?.number,
    assignees: pr.assignees.map(item => item.login).sort(),
    reviewers: pr.requested_reviewers.map(item => item.login).sort(),
    teams: pr.requested_teams.map(item => item.id).sort(),
    labels: pr.labels.map(item => item.name).filter(name => !managedLabels.includes(name)).sort()
  })).digest('hex');
}

function readClock(comment) {
  const clock = JSON.parse(comment.body.slice(PREFIX.length).split('\n-->')[0]);
  if (!Number.isFinite(Date.parse(clock.activityAt)) ||
      !Number.isFinite(Date.parse(clock.observedAt)) ||
      !/^[a-f0-9]{64}$/.test(clock.fingerprint)) throw new Error('Invalid persisted KP clock');
  if (clock.commentIds !== undefined) validateCommentIdentities(clock.commentIds);
  return clock;
}

async function activity(github, repo, pr, comment, comments, settings, now = Date.now()) {
  const hash = fingerprint(pr, settings.managedLabels);
  const clock = comment ? readClock(comment) : {
    activityAt: pr.updated_at, fingerprint: hash
  };
  if (!Number.isFinite(Date.parse(clock.activityAt))) throw new Error('Missing PR update time');
  const summaries = [];
  let after = null;
  const cursors = new Set();
  do {
    const edited = await github.graphql(`query($owner:String!,$repo:String!,$number:Int!,$after:String) {
      repository(owner:$owner,name:$repo) { pullRequest(number:$number) {
        lastEditedAt reviews(first:100,after:$after) {
          nodes { submittedAt lastEditedAt } pageInfo { hasNextPage endCursor }
        }
      } }
    }`, {...repo, number: pr.number, after});
    const record = edited.repository?.pullRequest;
    if (!record || (record.lastEditedAt !== null && !Number.isFinite(Date.parse(record.lastEditedAt)))) {
      throw new Error(`Missing or invalid server PR edit time on #${pr.number}`);
    }
    summaries.push({updated_at: record.lastEditedAt});
    const connection = record.reviews;
    if (!Array.isArray(connection?.nodes) || typeof connection.pageInfo?.hasNextPage !== 'boolean') {
      throw new Error(`Missing review-summary activity on #${pr.number}`);
    }
    for (const review of connection.nodes) {
      if (review.submittedAt === null) continue;
      if (!Number.isFinite(Date.parse(review.submittedAt)) ||
          (review.lastEditedAt !== null && !Number.isFinite(Date.parse(review.lastEditedAt)))) {
        throw new Error(`Invalid review-summary time on #${pr.number}`);
      }
      summaries.push({updated_at: review.submittedAt}, {updated_at: review.lastEditedAt});
    }
    if (!connection.pageInfo.hasNextPage) break;
    after = connection.pageInfo.endCursor;
    if (typeof after !== 'string' || !after || cursors.has(after)) {
      throw new Error(`Invalid review-summary pagination on #${pr.number}`);
    }
    cursors.add(after);
  } while (true);
  const events = await github.paginate(github.rest.issues.listEventsForTimeline, {
    ...repo, issue_number: pr.number, per_page: 100
  });
  const reviews = await github.paginate(github.rest.pulls.listReviewComments, {
    ...repo, pull_number: pr.number, per_page: 100
  });
  const commentIds = commentIdentities(comments, reviews, settings);
  if (!Number.isFinite(now)) throw new Error('Invalid comment observation time');
  let latest = clock.activityAt;
  if (clock.commentIds && ['issue', 'review'].some(kind => {
    const current = new Set(commentIds[kind]);
    return clock.commentIds[kind].some(id => !current.has(id));
  }) && now > Date.parse(latest)) {
    latest = new Date(now).toISOString();
  }
  let bookkeeping = false;
  for (const event of [...events, ...comments, ...reviews, ...summaries]) {
    if (event.event === 'committed') continue;
    const time = event.updated_at || event.created_at || event.submitted_at;
    if (!time) continue;
    const actor = event.actor?.login || event.user?.login;
    const ownLabel = ['labeled', 'unlabeled'].includes(event.event) &&
      [settings.event, ...settings.managedLabels].includes(event.label?.name);
    const ownComment = event.body?.startsWith(PREFIX) || event.body === settings.message;
    if (actor === BOT && (ownLabel || ownComment)) bookkeeping = true;
    else if (Date.parse(time) > Date.parse(latest)) latest = time;
  }
  // Fingerprints detect PR edits absent from timeline; bot timestamp skew is not activity.
  if (hash !== clock.fingerprint || (!comment && !bookkeeping)) {
    if (Date.parse(pr.updated_at) > Date.parse(latest)) latest = pr.updated_at;
  }
  return {activityAt: latest, fingerprint: hash, commentIds};
}

function validateCommentIdentities(value) {
  if (!value || typeof value !== 'object' ||
      Object.keys(value).sort().join(',') !== 'issue,review' ||
      !['issue', 'review'].every(kind => Array.isArray(value[kind]) &&
        value[kind].every((id, index, ids) => Number.isSafeInteger(id) && id > 0 &&
          (index === 0 || id > ids[index - 1])))) {
    throw new Error('Invalid persisted KP comment identities');
  }
}

function commentIdentities(comments, reviews, settings) {
  const result = {};
  for (const [kind, entries] of [['issue', comments], ['review', reviews]]) {
    if (!Array.isArray(entries)) throw new Error('Missing paginated KP comments');
    result[kind] = entries.filter(item => !(item.user?.login === BOT &&
      (item.body?.startsWith(PREFIX) || item.body === settings.message))).map(item => item.id)
      .sort((left, right) => left - right);
  }
  validateCommentIdentities(result);
  return result;
}

async function initialize({github, context, core, pr, eventLabel, managedLabels}) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: pr.number, per_page: 100
  });
  if (selectClock(comments, core, pr.number)) return;
  if (!Number.isFinite(Date.parse(pr.updated_at)) ||
      !eventLabel || managedLabels.some(label => !label)) throw new Error('Invalid enrollment clock settings');
  const enrolled = {...pr, labels: [...pr.labels, {name: eventLabel}]};
  const clock = {activityAt: pr.updated_at, fingerprint: fingerprint(enrolled, managedLabels),
    observedAt: pr.updated_at};
  await github.rest.issues.createComment({
    ...context.repo, issue_number: pr.number, body: PREFIX + JSON.stringify(clock) +
      '\n-->\nBusiness-day reminder clock (managed by the documentation bot).'
  });
  core.info(`Preserved pre-enrollment activity for #${pr.number}.`);
}

function selectClock(comments, core, number) {
  const clocks = comments.filter(item =>
    item.user?.login === BOT && item.body?.startsWith(PREFIX));
  const ids = new Set();
  for (const comment of clocks) {
    readClock(comment);
    if (!Number.isSafeInteger(comment.id) || comment.id <= 0 || ids.has(comment.id)) {
      throw new Error(`Invalid KP clock comment identity on #${number}`);
    }
    ids.add(comment.id);
  }
  clocks.sort((left, right) => left.id - right.id);
  if (clocks.length > 1) {
    core.info(`Concurrent KP initialization on #${number}; using oldest clock comment ${clocks[0].id}.`);
  }
  return clocks[0];
}

async function saveClock(github, repo, core, pr, comment, clock) {
  const previous = comment && readClock(comment);
  if (previous && previous.activityAt === clock.activityAt && previous.fingerprint === clock.fingerprint &&
      JSON.stringify(previous.commentIds) === JSON.stringify(clock.commentIds)) {
    return comment;
  }
  const body = PREFIX + JSON.stringify({...clock, observedAt: pr.updated_at}) +
    '\n-->\nBusiness-day reminder clock (managed by the documentation bot).';
  const response = comment
    ? await github.rest.issues.updateComment({...repo, comment_id: comment.id, body})
    : await github.rest.issues.createComment({...repo, issue_number: pr.number, body});
  core.info(`Recorded business-day activity clock for #${pr.number}.`);
  return response.data;
}

function configuration() {
  const settings = {
    event: process.env.EVENT_LABEL,
    due: process.env.REMINDER_DUE_LABEL,
    marker: process.env.AUTHOR_REMINDER_LABEL,
    exempt: process.env.EXEMPT_LABEL,
    message: process.env.AUTHOR_REMINDER_MESSAGE
  };
  settings.managedLabels = [settings.due, settings.marker];
  const days = Number(process.env.INACTIVITY_DAYS);
  if (!Object.values(settings).every(value => value?.length) ||
      !Number.isInteger(days) || days < 0) {
    throw new Error('Invalid KP business clock settings');
  }
  return {settings, days};
}

async function reconcile({github, context, core, now = Date.now()}) {
  const {settings, days} = configuration();
  // Label definitions remain manually managed. Fail before changing any PR.
  await github.rest.issues.getLabel({...context.repo, name: settings.due});
  for await (const page of github.paginate.iterator(github.rest.pulls.list, {
    ...context.repo, state: 'open', per_page: 100
  })) {
    for (const candidate of page.data) {
      if (!candidate.labels.some(label => label.name === settings.event)) continue;
      const {data: pr} = await github.rest.pulls.get({
        ...context.repo, pull_number: candidate.number
      });
      if (pr.state !== 'open' || !pr.labels.some(label => label.name === settings.event)) continue;
      const comments = await github.paginate(github.rest.issues.listComments, {
        ...context.repo, issue_number: pr.number, per_page: 100
      });
      let comment = selectClock(comments, core, pr.number);
      let clock = await activity(github, context.repo, pr, comment, comments, settings, now);
      comment = await saveClock(github, context.repo, core, pr, comment, clock);
      const has = label => pr.labels.some(item => item.name === label);
      // Never touch a marker here. Stock stale owns posting and cleanup.
      const due = !pr.draft && !has(settings.exempt) && isDue(clock.activityAt, now, days) &&
        (has(settings.due) || !has(settings.marker));
      if (due && !has(settings.due)) {
        await github.rest.issues.addLabels({
          ...context.repo, issue_number: pr.number, labels: [settings.due]
        });
      } else if (!due && has(settings.due)) {
        await github.rest.issues.removeLabel({
          ...context.repo, issue_number: pr.number, name: settings.due
        });
      }
    }
  }
}


async function canPost({github, context, core, number, now = Date.now()}) {
  const {settings, days} = configuration();
  const {data: pr} = await github.rest.pulls.get({...context.repo, pull_number: number});
  if (pr.state !== 'open') {
    core.info(`Skipping reminder for closed PR #${number}.`);
    return false;
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: number, per_page: 100
  });
  const comment = selectClock(comments, core, number);
  if (!comment) throw new Error(`Expected one KP clock before posting on #${number}`);
  const clock = await activity(github, context.repo, pr, comment, comments, settings, now);
  const {data: latest} = await github.rest.pulls.get({...context.repo, pull_number: number});
  const has = label => latest.labels.some(item => item.name === label);
  const stable = latest.updated_at === pr.updated_at &&
    latest.comments === pr.comments && latest.review_comments === pr.review_comments &&
    fingerprint(latest, settings.managedLabels) === fingerprint(pr, settings.managedLabels);
  if (!stable) {
    core.info(`Skipped reminder for #${number} because activity changed during validation; no bookkeeping written.`);
    return false;
  }
  const due = latest.state === 'open' && !latest.draft &&
    has(settings.event) && has(settings.due) && !has(settings.marker) &&
    !has(settings.exempt) && isDue(clock.activityAt, now, days);
  if (!due) {
    if (latest.state === 'open' && has(settings.due)) {
      await saveClock(github, context.repo, core, pr, comment, clock);
      await github.rest.issues.removeLabel({
        ...context.repo, issue_number: number, name: settings.due
      });
    }
    core.info(`Skipped reminder for #${number} after fresh activity/eligibility checks.`);
  }
  if (due) await saveClock(github, context.repo, core, pr, comment, clock);
  return due;
}

module.exports = {isDue, fingerprint, readClock, activity, reconcile, canPost, initialize, PREFIX};

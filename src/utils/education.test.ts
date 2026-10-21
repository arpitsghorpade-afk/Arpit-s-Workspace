import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGradeTier,
  calculateLevel,
  calculateSkillMastery,
  buildSocraticPrompt,
} from './education.ts';

test('getGradeTier returns correct tier and tone for Grade 3 (Primary)', () => {
  const result = getGradeTier(3);
  assert.equal(result.tier, 'primary');
  assert.match(result.tone, /playful/);
});

test('getGradeTier returns correct tier for Grade 8 (Middle)', () => {
  const result = getGradeTier(8);
  assert.equal(result.tier, 'middle');
  assert.match(result.title, /Middle School/);
});

test('getGradeTier returns correct tier for Grade 12 (Senior)', () => {
  const result = getGradeTier(12);
  assert.equal(result.tier, 'senior');
  assert.match(result.tone, /pre-collegiate/);
});

test('calculateLevel computes accurate levels and progress percentage', () => {
  const res1 = calculateLevel(0);
  assert.equal(res1.level, 1);
  assert.equal(res1.progressPct, 0);

  const res2 = calculateLevel(750); // level 2 (500 to 1000), current 250/500 = 50%
  assert.equal(res2.level, 2);
  assert.equal(res2.progressPct, 50);

  const res3 = calculateLevel(1500); // level 4
  assert.equal(res3.level, 4);
});

test('calculateSkillMastery calculates weighted score and passport eligibility', () => {
  // Low score, no projects
  const nov = calculateSkillMastery({
    lessonCompletionRate: 0.2,
    quizAverageScore: 50,
    verifiedProjectsCount: 0,
  });
  assert.equal(nov.isPassportEligible, false);
  assert.ok(nov.masteryScore < 50);

  // High score with 3 projects
  const master = calculateSkillMastery({
    lessonCompletionRate: 1.0,
    quizAverageScore: 92,
    verifiedProjectsCount: 3,
  });
  assert.equal(master.isPassportEligible, true);
  assert.ok(master.masteryScore >= 80);
});

test('buildSocraticPrompt includes language directives and socratic instructions', () => {
  const promptEn = buildSocraticPrompt({
    grade: 10,
    subject: 'Artificial Intelligence & Neural Networks',
    language: 'en',
    mode: 'socratic_hints',
  });
  assert.match(promptEn, /Grade 10/);
  assert.match(promptEn, /Socratic AI Tutor/);
  assert.match(promptEn, /Do NOT give away the final answer directly/);

  const promptHi = buildSocraticPrompt({
    grade: 6,
    subject: 'Science',
    language: 'hi',
    mode: 'explain_concept',
  });
  assert.match(promptHi, /हिंदी/);

  const promptMr = buildSocraticPrompt({
    grade: 4,
    subject: 'Math',
    language: 'mr',
    mode: 'socratic_hints',
  });
  assert.match(promptMr, /मराठी/);
});

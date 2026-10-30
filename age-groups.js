"use strict";

// Shared by registration and analytics. Never infer narrower ages from old ranges.
window.WGP1_AGE_GROUPS = Object.freeze({
  current: Object.freeze([
    { value: "under-10", label: "Under 10", translationKey: "ageUnder10" },
    { value: "10-19", label: "10–19" },
    { value: "20-29", label: "20–29" },
    { value: "30-39", label: "30–39" },
    { value: "40-49", label: "40–49" },
    { value: "50-59", label: "50–59" },
    { value: "60-69", label: "60–69" },
    { value: "70-plus", label: "70+", translationKey: "age70Plus" },
  ].map(Object.freeze)),
  legacy: Object.freeze([
    { value: "20-39", label: "20–39 (previous range)" },
    { value: "40-59", label: "40–59 (previous range)" },
    { value: "60-plus", label: "60+ (previous range)" },
  ].map(Object.freeze)),
});

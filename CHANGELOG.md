## [5.0.5](https://github.com/jshor/datebook/compare/v5.0.4...v5.0.5) (2020-10-19)


### Bug Fixes

* **ics:** corrects timestamp format for recurrences ([497a97e](https://github.com/jshor/datebook/commit/497a97e7d07a1329f6613d4c2a5b77902e6f10c2))



## [5.0.4](https://github.com/jshor/datebook/compare/v5.0.3...v5.0.4) (2020-10-19)



## [5.0.3](https://github.com/jshor/datebook/compare/v5.0.2...v5.0.3) (2020-10-19)



## [5.0.2](https://github.com/jshor/datebook/compare/v5.0.1...v5.0.2) (2020-09-28)



## [5.0.1](https://github.com/jshor/datebook/compare/v5.0.0...v5.0.1) (2020-09-28)



# [5.0.0](https://github.com/jshor/datebook/compare/v4.1.11...v5.0.0) (2020-09-28)


### Code Refactoring

* removes ability to specify time as strings ([af23513](https://github.com/jshor/datebook/commit/af2351304d481aaa33139c7c9b1be630fc5cc614))
* removes calendars util ([82e2516](https://github.com/jshor/datebook/commit/82e25168c2c4937f044444e6132604560288b0da))


### BREAKING CHANGES

* Removes getGoogleCalendarUrl(), getYahooCalendarUrl(),
getMicrosoftCalendarUrl(), and downloadIcs().
* Removes ability to pass `start`, `end`, or
`recurrence.end` as strings. They must now be passed as Date objects.



## [4.1.11](https://github.com/jshor/datebook/compare/v4.1.10...v4.1.11) (2020-09-28)


### Bug Fixes

* **outlook:** prevents path from being encoded ([#115](https://github.com/jshor/datebook/issues/115)) ([f588947](https://github.com/jshor/datebook/commit/f588947d590263cc3faf10ccc5b063852b3432c6))



## [4.1.10](https://github.com/jshor/datebook/compare/v4.1.9...v4.1.10) (2020-09-28)


### Bug Fixes

* **yahoo:** corrects weekday recurrences ([#114](https://github.com/jshor/datebook/issues/114)) ([e747e51](https://github.com/jshor/datebook/commit/e747e513de7a96086b503e3c3b982f22239b2206))



## [4.1.9](https://github.com/jshor/datebook/compare/v4.1.8...v4.1.9) (2020-09-26)


### Bug Fixes

* updates formats to use UTC dates ([#113](https://github.com/jshor/datebook/issues/113)) ([ebdd0d1](https://github.com/jshor/datebook/commit/ebdd0d1bc8ffb3b154f22c6d7e2b3cacabf8d355))



## [4.1.8](https://github.com/jshor/datebook/compare/v4.1.7...v4.1.8) (2020-09-26)


### Bug Fixes

* changes date params to use JS Date ([#112](https://github.com/jshor/datebook/issues/112)) ([289f09c](https://github.com/jshor/datebook/commit/289f09c45f1401224fc2202811878c9f36ad115f)), closes [#93](https://github.com/jshor/datebook/issues/93) [#104](https://github.com/jshor/datebook/issues/104) [#107](https://github.com/jshor/datebook/issues/107)



## [4.1.7](https://github.com/jshor/datebook/compare/v4.1.6...v4.1.7) (2020-09-26)


### Bug Fixes

* **docs:** corrects base path ([#109](https://github.com/jshor/datebook/issues/109)) ([a807507](https://github.com/jshor/datebook/commit/a80750763f0df2588edc8bfa3eb1fa007afe9711))
* reduces bundle size ([#108](https://github.com/jshor/datebook/issues/108)) ([986af93](https://github.com/jshor/datebook/commit/986af932d7ce1ee6ec435f5a31e407dd549b7848))



## [4.1.6](https://github.com/jshor/datebook/compare/v4.1.3...v4.1.6) (2020-09-14)


### Bug Fixes

* don't create blob until we need to ([#101](https://github.com/jshor/datebook/issues/101)) ([c6e3ee6](https://github.com/jshor/datebook/commit/c6e3ee6413493b142dde7fce9c9584fd5ac5b570))
* **edge:** updates incorrect Safari check ([#94](https://github.com/jshor/datebook/issues/94)) ([#96](https://github.com/jshor/datebook/issues/96)) ([901f87d](https://github.com/jshor/datebook/commit/901f87d341fa0fcf9f3826e1693f1e425eaec60b))



## [4.1.3](https://github.com/jshor/datebook/compare/v4.1.2...v4.1.3) (2020-06-12)


### Bug Fixes

* **ie:** fixes for IE11 ([#91](https://github.com/jshor/datebook/issues/91)) ([#92](https://github.com/jshor/datebook/issues/92)) ([c13cf49](https://github.com/jshor/datebook/commit/c13cf49610e9bf10793154d05ec23d694a658ea8))
* **readme:** adds link to generator [ci skip] ([388b87f](https://github.com/jshor/datebook/commit/388b87f9f0c0150555083d361346bc08075f3613))



## [4.1.2](https://github.com/jshor/datebook/compare/v4.1.1...v4.1.2) (2020-05-13)


### Bug Fixes

* **timestamps:** fixes calendar timestamp formats ([#84](https://github.com/jshor/datebook/issues/84)) ([#85](https://github.com/jshor/datebook/issues/85)) ([0e41dd7](https://github.com/jshor/datebook/commit/0e41dd7369835bfc341ae939ec43e821acfdc550))



## [4.1.1](https://github.com/jshor/datebook/compare/v4.1.0...v4.1.1) (2020-04-29)


### Bug Fixes

* **ics:** removes maxlen for all fields ([#58](https://github.com/jshor/datebook/issues/58)) ([#83](https://github.com/jshor/datebook/issues/83)) ([7cf979e](https://github.com/jshor/datebook/commit/7cf979e71e99876bde4918c6b2a71cbe634ae460))



# [4.1.0](https://github.com/jshor/datebook/compare/v4.0.0...v4.1.0) (2020-04-29)


### Features

* **nodejs:** adds SSR support ([#65](https://github.com/jshor/datebook/issues/65)) ([e7d8ea5](https://github.com/jshor/datebook/commit/e7d8ea573b8a5d6af42c2e28165c9b6ab884cbe6))



# [4.0.0](https://github.com/jshor/datebook/compare/v1.3.5...v4.0.0) (2020-04-29)


### Bug Fixes

* **bundle:** replaces parcel with webpack to address UMD export issues ([e4f7fc6](https://github.com/jshor/datebook/commit/e4f7fc6234332ff26d45cbe2c799267857c1c3e3))


### Code Refactoring

* converts component to be a vanilla js library ([9a466aa](https://github.com/jshor/datebook/commit/9a466aa881675d407d6410d699b9a7c4f896b3cb))


### BREAKING CHANGES

* This is no longer an Angular.js component. It is now a pure JS library and will be
incompatible with old usage.



## [1.3.5](https://github.com/jshor/datebook/compare/v1.3.4...v1.3.5) (2019-06-10)


### Features

* **core:** adds core code for vanilla js lib ([7b3c9d9](https://github.com/jshor/datebook/commit/7b3c9d9da1e59153b4aa32fd3f6302be59999f27))



## [1.1.6](https://github.com/jshor/datebook/compare/v1.1.5...v1.1.6) (2016-06-28)



## 1.1.5 (2016-05-11)




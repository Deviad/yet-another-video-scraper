const ConstantsMap = {
  General: {
    USER_AGENT:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0'
  },
  CourseHunters: {
    COURSE_SCRAPER_TITLE_SELECTOR: Symbol.for('.lessons-list__li span[itemprop="name"]'),
    COURSE_SCRAPER_URL_SELECTOR: Symbol.for(`.lessons-list__li link[itemprop="url"]`)
  }
};
export default ConstantsMap;

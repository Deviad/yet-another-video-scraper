const ConstantsMap = {
  General: {
    USER_AGENT:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
  },
  CourseHunters: {
    COURSE_SCRAPER_TITLE_SELECTOR: Symbol.for('.lessons-list__li span[itemprop="name"]'),
    COURSE_SCRAPER_URL_SELECTOR: Symbol.for(`.lessons-list__li link[itemprop="url"]`)
  }
};
export default ConstantsMap;

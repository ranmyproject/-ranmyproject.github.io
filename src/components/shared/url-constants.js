// export const BASE_URL = "http://3.23.160.50:8000";
export const BASE_URL = "http://192.168.0.104:8000";

export const USER_BASE_URL = BASE_URL+"/api/user/";
export const POST_BASE_URL = BASE_URL+"/api/post/";
export const ADMIN_BASE_URL = BASE_URL+"/api/admin/";

export const USER_REGISTRATION = USER_BASE_URL+"registration";
export const LOGIN_URL = USER_BASE_URL+"loginOrSingup";
export const VERIFY_OTP_PASSWORD = USER_BASE_URL+"verifyOtpPassword";
export const POST_PANKTIYAAN = POST_BASE_URL+"add";
export const GET_PANKTIYAAN = POST_BASE_URL+"get";
export const USER_POST_COUNT = POST_BASE_URL+"getUserPostCount";

export const SUPER_ADMIN_POST_COUNT = POST_BASE_URL+"getSuperAdminPostCount";

export const USER_POST = POST_BASE_URL+"getUserPost";

export const GET_SUPER_ADMIN_POST = POST_BASE_URL+"getSuperAdminPost";

export const GET_APPROVED_POST = POST_BASE_URL+"getApprovedPost";

export const ADMIN_GET_POST = POST_BASE_URL+"getAdminPost";
export const ADMIN_GET_POST_COUNT = POST_BASE_URL+"getAdminPostCount";
export const ADMIN_POST_ACTION = POST_BASE_URL+"updateStage";

export const UPDATE_POST_DETAIL = POST_BASE_URL+"updatePostDetail";

export const HOME_POST_API = POST_BASE_URL+"home";


export const VERIFY_GOOGLE_AUTH = USER_BASE_URL+"verifyGoogleAuth";
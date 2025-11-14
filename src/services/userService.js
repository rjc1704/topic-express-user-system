async function createUser(user) {
  try {
    // TODO: 회원가입 로직 구현
    // 1. 이메일 중복 여부 확인
    // 2. 이메일 중복 시 409 코드로 응답, error.data 에는 { email: user.email } 형식으로 전달
    // 3. 이메일 중복 아니면 회원가입 진행
    // 4. 회원가입 성공 시 password 제외한 유저 데이터 반환
  } catch (error) {
    const customError = new Error("데이터베이스 작업 중 오류가 발생했습니다");
    customError.code = 500;
    throw customError;
  }
}

export default {
  createUser,
};

### API 接口文档

#### 通行证

##### 注册
- /api/passport/register.json
- { nickname, username, password }
- { error: 0, data: userDetail, token: TOKEN }

##### 登录
- /api/passport/login.json
- { username, password }
- { error: 0, data: userDetail, token: TOKEN }

##### 修改密码
- /api/passport/changePwd.json
- { username, password, newPassword }
- { error: 0, data: '' }

##### 个人资料
- /api/user/edit.json
- { nickname, gender, birthday, city, contact, desc, avatar }
- { error: 0, data: '' }

#### 视频

##### 关注推荐
- /api/video/focus.json
- { q, page, pageSize }
- { error: 0, data: { videoList, pagination } }

##### 全网推荐
- /api/video/recommend.json
- { q, page, pageSize }
- { error: 0, data: { videoList, pagination } }

##### 视频列表
- /api/video/list.json
- { q, userId, page, pageSize }
- { error: 0, data: { videoList, pagination } }

##### 我的视频列表
- /api/video/my.json
- { q, open, page, pageSize }
- { error: 0, data: { videoList, pagination } }

##### 我关注的视频列表
- /api/video/like.json
- { q, page, pageSize }
- { error: 0, data: { videoList, pagination } }

##### 关注视频
- /api/video/focus.json
- { videoId, status }
- { error: 0, data: '' }

##### 分享视频
- /api/video/share.json
- { link, title, tags, isOpen }
- { error: 0, data: videoId }

##### 取消关注视频
- /api/video/unfocus.json
- { videoId }
- { error: 0, data: '' }

##### 取消分享视频
- /api/video/forget.json
- { videoId }
- { error: 0, data: videoId }

### 用户

#### 个人信息
- /api/user/detail.json
- { }
- { error: 0, data: userInfo }

#### 用户信息
- /api/user/info.json
- { userId }
- { error: 0, data: userInfo }

#### 我关注的人
- /api/user/like.json
- { q, page, pageSize }
- { error: 0, data: { userList, pagination } }

#### 关注我的人
- /api/user/follow.json
- { q, page, pageSize }
- { error: 0, data: { userList, pagination } }

#### 关注用户
- /api/user/focus.json
- { userId }
- { error: 0, data: '' }

#### 取消关注用户
- /api/user/unfocus.json
- { userId }
- { error: 0, data: '' }

#### 修改关注用户备注
- /api/user/remark.json
- { userId, remarkname }
- { error: 0, data: '' }
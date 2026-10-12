class ReplyService {
  constructor(replyRepository, commentRepository, threadRepository) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addReply({ content, owner, threadId, commentId }) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    return this._replyRepository.addReply({ content, owner, commentId });
  }

  async deleteReply({ threadId, commentId, replyId, owner }) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = ReplyService;
